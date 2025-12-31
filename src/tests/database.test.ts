import { describe, it, expect, beforeEach } from 'vitest';
import { Database } from '../database';
import type { Vehicle, Refuel } from '../types';

describe('Database', () => {
    let db: Database;

    beforeEach(async () => {
        db = new Database();
        await db.init();
        await db.clearAllData();
    });

    describe('Vehicle operations', () => {
        it('should save and retrieve a vehicle', async () => {
            const vehicle: Vehicle = {
                model: 'Renault Clio',
                capacity: 50
            };

            const id = await db.saveVehicle(vehicle);
            expect(id).toBeDefined();

            const savedVehicle = await db.getVehicle();
            expect(savedVehicle).toBeDefined();
            expect(savedVehicle?.model).toBe(vehicle.model);
            expect(savedVehicle?.capacity).toBe(vehicle.capacity);
        });

        it('should return null when no vehicle is saved', async () => {
            const vehicle = await db.getVehicle();
            expect(vehicle).toBeNull();
        });

        it('should update existing vehicle', async () => {
            const vehicle1: Vehicle = {
                model: 'Renault Clio',
                capacity: 50
            };

            const id1 = await db.saveVehicle(vehicle1);

            const vehicle2: Vehicle = {
                id: id1,
                model: 'Peugeot 308',
                capacity: 55
            };

            await db.saveVehicle(vehicle2);

            const savedVehicle = await db.getVehicle();
            expect(savedVehicle?.model).toBe('Peugeot 308');
            expect(savedVehicle?.capacity).toBe(55);
        });
    });

    describe('Refuel operations', () => {
        it('should add and retrieve refuels', async () => {
            const refuel: Refuel = {
                date: new Date('2025-01-15'),
                liters: 45.5,
                price: 75.50,
                odometer: 12345
            };

            const id = await db.addRefuel(refuel);
            expect(id).toBeDefined();

            const refuels = await db.getAllRefuels();
            expect(refuels).toHaveLength(1);
            expect(refuels[0].liters).toBe(refuel.liters);
            expect(refuels[0].price).toBe(refuel.price);
            expect(refuels[0].odometer).toBe(refuel.odometer);
        });

        it('should return empty array when no refuels exist', async () => {
            const refuels = await db.getAllRefuels();
            expect(refuels).toEqual([]);
        });

        it('should return refuels sorted by date descending', async () => {
            const refuel1: Refuel = {
                date: new Date('2025-01-10'),
                liters: 40,
                price: 65,
                odometer: 10000
            };

            const refuel2: Refuel = {
                date: new Date('2025-01-15'),
                liters: 45,
                price: 70,
                odometer: 10500
            };

            const refuel3: Refuel = {
                date: new Date('2025-01-12'),
                liters: 42,
                price: 68,
                odometer: 10250
            };

            await db.addRefuel(refuel1);
            await db.addRefuel(refuel2);
            await db.addRefuel(refuel3);

            const refuels = await db.getAllRefuels();
            expect(refuels).toHaveLength(3);
            expect(refuels[0].date.getTime()).toBe(refuel2.date.getTime());
            expect(refuels[1].date.getTime()).toBe(refuel3.date.getTime());
            expect(refuels[2].date.getTime()).toBe(refuel1.date.getTime());
        });

        it('should delete a refuel', async () => {
            const refuel: Refuel = {
                date: new Date('2025-01-15'),
                liters: 45.5,
                price: 75.50,
                odometer: 12345
            };

            const id = await db.addRefuel(refuel);
            let refuels = await db.getAllRefuels();
            expect(refuels).toHaveLength(1);

            await db.deleteRefuel(id);
            refuels = await db.getAllRefuels();
            expect(refuels).toHaveLength(0);
        });
    });

    describe('Clear all data', () => {
        it('should clear all vehicles and refuels', async () => {
            const vehicle: Vehicle = {
                model: 'Renault Clio',
                capacity: 50
            };

            const refuel: Refuel = {
                date: new Date('2025-01-15'),
                liters: 45.5,
                price: 75.50,
                odometer: 12345
            };

            await db.saveVehicle(vehicle);
            await db.addRefuel(refuel);

            await db.clearAllData();

            const savedVehicle = await db.getVehicle();
            const refuels = await db.getAllRefuels();

            expect(savedVehicle).toBeNull();
            expect(refuels).toHaveLength(0);
        });
    });
});
