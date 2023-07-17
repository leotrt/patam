import { createStore, withProps } from '@ngneat/elf';
import { localStorageStrategy, persistState } from '@ngneat/elf-persist-state';

export interface ConfigProps {
  baseSalary: number | null;
  hourlyCost: number | null
  hoursPerDay: number[]
  mealCost: number[];
  dailyMaintenanceFees: number;
  hideWeekends: boolean;
}

export const configStore = createStore(
{ name: 'auth' },
withProps<ConfigProps>({
  baseSalary: 249.6,
  hourlyCost: 3.2,
  hoursPerDay: [
    0, 6, 6, 0, 6, 0, 0
  ],
  mealCost: [
    0, 5, 5, 0, 5, 0, 0
  ],
  dailyMaintenanceFees: 3.08,
  hideWeekends: false
}));

persistState(configStore, {
  key: 'patam-config',
  storage: localStorageStrategy,
});

export const updateConfig = (config: ConfigProps) => {
  configStore.update(state => ({ ...state, ...config }));
}
