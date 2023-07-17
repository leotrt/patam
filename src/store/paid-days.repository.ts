import { deleteEntities, upsertEntities, withEntities } from '@ngneat/elf-entities';
import { createStore } from '@ngneat/elf';
import { localStorageStrategy, persistState } from '@ngneat/elf-persist-state';

export interface PaidDayModel {
  id: string;
  mealCost: number;
  nbHours: number;
  dailyMaintenanceFees: number;
  pto: boolean;
  out: boolean;
  bankHoliday: boolean;
}

export interface PaidDayUI extends PaidDayModel {
  active: boolean;
  day: number;
  edited: boolean;
  originalNbHours?: number;
}

export const paidDaysStore = createStore(
{ name: 'paid-days' },
withEntities<PaidDayModel>()
);

export const upsertPaidDay = (date: Date, day: PaidDayModel) => {
  paidDaysStore.update(upsertEntities({
    ...day,
    id: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
  }));
}

export const deletePaidDay = (id: string): void => {
  paidDaysStore.update(deleteEntities(id));
}

persistState(paidDaysStore, {
  key: 'patam-paid-days',
  storage: localStorageStrategy,
})
