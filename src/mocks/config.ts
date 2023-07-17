export interface Config {
    baseSalary: number;
    hourlyCost: number;
    hoursPerDay: number[];
    mealCost: number[];
    dailyMaintenanceFees: number;
    hideWeekends: boolean;
}

export const config: Config = {
    baseSalary: 249.2,
    hourlyCost: 3.2,
    hoursPerDay: [
        0, 6, 6, 0, 6, 0, 0
    ],
    mealCost: [
        0, 5, 5, 0, 5, 0, 0
    ],
    dailyMaintenanceFees: 3.08,
    hideWeekends: false
}
