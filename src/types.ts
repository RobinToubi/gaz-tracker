export interface Vehicle {
    id?: number;
    model: string;
    capacity: number;
}

export interface Refuel {
    id?: number;
    date: Date;
    liters: number;
    price: number;
    odometer: number;
}

export interface Statistics {
    averageConsumption: number;
    totalLiters: number;
    totalCost: number;
    averagePricePerLiter: number;
    totalDistance: number;
}
