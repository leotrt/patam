import './Summary.css';
import PageContainer from '../components/page-container/PageContainer';
import { useObservable } from '@ngneat/react-rxjs';
import { days$ } from '../utils/dates';
import { map } from 'rxjs/operators';
import { pinFormatter } from '../components/calendar-day/CalendarDayModal';
import { configStore } from '../store/config.repository';
import { select } from '@ngneat/elf';
import MonthSwiper from '../components/MonthSwiper';
import { useState } from 'react';
import { startOfMonth } from 'date-fns';

const Summary: React.FC = () => {
  const [month, setMonth] = useState(startOfMonth(new Date()));

  const [nbDays] = useObservable(days$.pipe(map(days => days.filter(day => (day.active || day.edited) && !day.bankHoliday).length)));

  const [totalHours] = useObservable(days$.pipe(map(days =>
  days.reduce((total, day) => total + (day.originalNbHours === undefined ? day.nbHours : (day.originalNbHours || 0)), 0)
  )));

  const [nbExtraHours] = useObservable(days$.pipe(map(days => days.reduce((total, day) => {
    const extraHours = day.nbHours - (day.originalNbHours || 0);
    return total + extraHours;
  }, 0))));

  const [totalMeals] = useObservable(days$.pipe(map(days =>
  days.reduce((acc, day) => acc + (day.out || day.pto || day.bankHoliday ? 0 : day.mealCost), 0)
  )));

  const [totalDailyMaintenanceFees] = useObservable(days$.pipe(map(days =>
  days.reduce((acc, day) => acc + (day.out || day.pto || day.bankHoliday ? 0 : day.dailyMaintenanceFees), 0)
  )));

  const [totalPtos] = useObservable(days$.pipe(map(days =>
  days.reduce((acc, day) => acc + (day.pto ? 1 : 0), 0)
  )));

  const [baseSalary] = useObservable(configStore.pipe(select(state => state.baseSalary)));
  const [hourlyRate] = useObservable(configStore.pipe(select(state => state.hourlyCost)));

  return (
  <PageContainer title="Résumé">
    <div className="summary-inner">
      <MonthSwiper month={month} setMonth={setMonth}>
        <div className={'summary-content'}>
          <div className={'wrapper'}>
            {
            baseSalary && hourlyRate &&
            (<div className={'summary-item'}>
              <div className={'summary-label'}>Salaire total</div>
              <div className="spacer"></div>
              <div className={'summary-value'}>
                {(Math.max(baseSalary + nbExtraHours * hourlyRate, (totalHours + nbExtraHours) * hourlyRate) || 0).toFixed(2)} €
              </div>
            </div>)
            }
            <div className={'summary-item'}>
              <div className={'summary-label'}>Jours</div>
              <div className="spacer"></div>
              <div className={'summary-value'}>{nbDays}</div>
            </div>
            <div className={'summary-item'}>
              <div className={'summary-label'}>Heures</div>
              <div className="spacer"></div>
              <div className={'summary-value'}>{pinFormatter(totalHours || 0)}</div>
            </div>
            <div className={'summary-item'}>
              <div className={'summary-label'}>Heures supp.</div>
              <div className="spacer"></div>
              <div className={'summary-value'}>{pinFormatter(nbExtraHours || 0)}</div>
            </div>
            <div className={'summary-item'}>
              <div className={'summary-label'}>Repas</div>
              <div className="spacer"></div>
              <div className={'summary-value'}>{(totalMeals || 0).toFixed(2)} €</div>
            </div>
            <div className={'summary-item'}>
              <div className={'summary-label'}>Frais</div>
              <div className="spacer"></div>
              <div className={'summary-value'}>{(totalDailyMaintenanceFees || 0).toFixed(2)} €</div>
            </div>
            <div className={'summary-item'}>
              <div className={'summary-label'}>Congés</div>
              <div className="spacer"></div>
              <div className={'summary-value'}>{(totalPtos || 0)}</div>
            </div>
          </div>
        </div>
      </MonthSwiper>
    </div>
  </PageContainer>
  );
};

export default Summary;
