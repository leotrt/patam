import { createStore, withProps } from '@ngneat/elf';

export interface Calendar {
  currentMonth: Date | null;
}

export const calendarStore = createStore(
{ name: 'calendar' },
withProps<Calendar>({
  currentMonth: null
})
);
