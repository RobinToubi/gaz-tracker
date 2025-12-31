import { describe, it, expect } from 'vitest';
import type { Refuel, Statistics } from '../types';

function calculateStatistics(refuels: Refuel[]): Statistics {
    if (refuels.length === 0) {
        return {
            averageConsumption: 0,
            totalLiters: 0,
            totalCost: 0,
            averagePricePerLiter: 0,
            totalDistance: 0
        };
    }

    const totalLiters = refuels.reduce((sum, r) => sum + r.liters, 0);
    const totalCost = refuels.reduce((sum, r) => sum + r.price, 0);
    const averagePricePerLiter = totalCost / totalLiters;

    let averageConsumption = 0;
    let totalDistance = 0;

    if (refuels.length >= 2) {
        const sortedRefuels = [...refuels].sort((a, b) => a.odometer - b.odometer);
        const minOdometer = sortedRefuels[0].odometer;
        const maxOdometer = sortedRefuels[sortedRefuels.length - 1].odometer;
        totalDistance = maxOdometer - minOdometer;

        if (totalDistance > 0) {
            averageConsumption = (totalLiters / totalDistance) * 100;
        }
    }

    return {
        averageConsumption,
        totalLiters,
        totalCost,
        averagePricePerLiter,
        totalDistance
    };
}

describe('Statistics calculation', () => {
    it('should return zero statistics for empty refuels', () => {
        const stats = calculateStatistics([]);

        expect(stats.averageConsumption).toBe(0);
        expect(stats.totalLiters).toBe(0);
        expect(stats.totalCost).toBe(0);
        expect(stats.averagePricePerLiter).toBe(0);
        expect(stats.totalDistance).toBe(0);
    });

    it('should calculate total cost and liters for single refuel', () => {
        const refuels: Refuel[] = [
            {
                date: new Date('2025-01-15'),
                liters: 50,
                price: 80,
                odometer: 10000
            }
        ];

        const stats = calculateStatistics(refuels);

        expect(stats.totalLiters).toBe(50);
        expect(stats.totalCost).toBe(80);
        expect(stats.averagePricePerLiter).toBe(1.6);
        expect(stats.averageConsumption).toBe(0);
        expect(stats.totalDistance).toBe(0);
    });

    it('should calculate consumption for multiple refuels', () => {
        const refuels: Refuel[] = [
            {
                date: new Date('2025-01-10'),
                liters: 50,
                price: 80,
                odometer: 10000
            },
            {
                date: new Date('2025-01-20'),
                liters: 45,
                price: 72,
                odometer: 10600
            }
        ];

        const stats = calculateStatistics(refuels);

        expect(stats.totalLiters).toBe(95);
        expect(stats.totalCost).toBe(152);
        expect(stats.averagePricePerLiter).toBeCloseTo(1.6, 2);
        expect(stats.totalDistance).toBe(600);
        expect(stats.averageConsumption).toBeCloseTo(15.83, 2);
    });

    it('should calculate correct average consumption', () => {
        const refuels: Refuel[] = [
            {
                date: new Date('2025-01-01'),
                liters: 40,
                price: 64,
                odometer: 5000
            },
            {
                date: new Date('2025-01-15'),
                liters: 45,
                price: 72,
                odometer: 5500
            },
            {
                date: new Date('2025-02-01'),
                liters: 50,
                price: 82,
                odometer: 6100
            }
        ];

        const stats = calculateStatistics(refuels);

        expect(stats.totalLiters).toBe(135);
        expect(stats.totalDistance).toBe(1100);
        expect(stats.averageConsumption).toBeCloseTo(12.27, 2);
    });

    it('should handle refuels not in odometer order', () => {
        const refuels: Refuel[] = [
            {
                date: new Date('2025-01-20'),
                liters: 45,
                price: 72,
                odometer: 10600
            },
            {
                date: new Date('2025-01-10'),
                liters: 50,
                price: 80,
                odometer: 10000
            }
        ];

        const stats = calculateStatistics(refuels);

        expect(stats.totalDistance).toBe(600);
        expect(stats.averageConsumption).toBeCloseTo(15.83, 2);
    });
});
