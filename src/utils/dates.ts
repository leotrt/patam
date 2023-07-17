import { addDays, addMonths, endOfMonth, format, setDate, startOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ConfigProps, configStore } from '../store/config.repository';
import { paidDaysStore, PaidDayUI } from '../store/paid-days.repository';
import { calendarStore } from '../store/calendar.repository';
import { select } from '@ngneat/elf';
import { combineLatestWith, filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { selectAllEntities } from '@ngneat/elf-entities';

export type DaysFactoryOptions = {
  month: Date | null;
  hoursPerDay: ConfigProps['hoursPerDay'];
  mealCost: ConfigProps['mealCost'];
  hideWeekends: ConfigProps['hideWeekends'];
  dailyMaintenanceFees: ConfigProps['dailyMaintenanceFees'];
}

export const generateMonths = (monthRange: number[]): Date[] => {
  const [before, after] = monthRange;
  const months = [];

  for (let i = before * (-1); i <= after; i++) {
    months.push(addMonths(startOfMonth(new Date()), i));
  }

  return months;
}

export const formatMonth = (date: Date): string => {
  return format(date, 'MMM uu', { locale: fr });
}

export const formatDay = (dayNbr: number | undefined, month: Date): string => {
  if (!dayNbr) return ('');

  const date = setDate(startOfMonth(month), dayNbr)
  return (format(date, 'EEE d', { locale: fr }))
}


export const days$: Observable<PaidDayUI[]> = calendarStore.pipe(
select(state => state.currentMonth),
combineLatestWith(paidDaysStore.pipe(selectAllEntities()), configStore.pipe(select(state => state))),
filter(([month, days, config]) => {
  return !!month
}),
map(([month, days, config]) => {

  const generatedDays = generateDays({ month, ...config });

  const savedDays = days.filter(day => day.id.startsWith(`${month!.getFullYear()}-${month!.getMonth()}`))
  .map(day => {
    const date = new Date(day.id);
    return {
      ...day,
      day: date.getDate(),
      active: true,
      edited: true,
      dailyMaintenanceFees: day.nbHours > 0 || day.mealCost > 0 ? config.dailyMaintenanceFees : 0
    }
  })

  return generatedDays.map(day => {
    const savedDay = savedDays.find(savedDay => savedDay.id === day.id);
    return savedDay ? {
      ...savedDay,
      originalNbHours: day.nbHours
    } : {
      ...day,
      edited: false,
      originalNbHours: day.nbHours,
    };
  });
})
);

export const generateDays = ({
                               month,
                               hoursPerDay,
                               mealCost,
                               hideWeekends,
                               dailyMaintenanceFees
                             }: DaysFactoryOptions): PaidDayUI[] => {
  if (!month) return ([]);

  const payDays: PaidDayUI[] = [];
  const startDate = startOfMonth(month!);
  const endDate = endOfMonth(startDate);

  for (let i = 0; i < endDate.getDate(); i++) {
    const currentDate = addDays(startDate, i);
    const dayOfWeek = currentDate.getDay();
    const active = hoursPerDay[dayOfWeek] !== 0 || mealCost[dayOfWeek] !== 0;

    if (!hideWeekends || (dayOfWeek !== 0 && dayOfWeek !== 6)) {
      payDays.push({
        id: `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`,
        day: i + 1,
        nbHours: hoursPerDay[dayOfWeek],
        mealCost: mealCost[dayOfWeek],
        pto: false,
        active,
        edited: false,
        out: false,
        dailyMaintenanceFees: active ? dailyMaintenanceFees : 0,
        bankHoliday: false,
      });
    }

  }

  return payDays;
}
