import type { Vehicle, Refuel } from './types.js';

const DB_NAME = 'GazTrackerDB';
const DB_VERSION = 1;
const VEHICLE_STORE = 'vehicle';
const REFUEL_STORE = 'refuels';

export class Database {
    private db: IDBDatabase | null = null;

    async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                if (!db.objectStoreNames.contains(VEHICLE_STORE)) {
                    db.createObjectStore(VEHICLE_STORE, { keyPath: 'id', autoIncrement: true });
                }

                if (!db.objectStoreNames.contains(REFUEL_STORE)) {
                    const refuelStore = db.createObjectStore(REFUEL_STORE, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    refuelStore.createIndex('date', 'date', { unique: false });
                }
            };
        });
    }

    async saveVehicle(vehicle: Vehicle): Promise<number> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([VEHICLE_STORE], 'readwrite');
            const store = transaction.objectStore(VEHICLE_STORE);

            const request = store.put(vehicle);

            request.onsuccess = () => resolve(request.result as number);
            request.onerror = () => reject(request.error);
        });
    }

    async getVehicle(): Promise<Vehicle | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([VEHICLE_STORE], 'readonly');
            const store = transaction.objectStore(VEHICLE_STORE);
            const request = store.getAll();

            request.onsuccess = () => {
                const vehicles = request.result;
                resolve(vehicles.length > 0 ? vehicles[0] : null);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async addRefuel(refuel: Refuel): Promise<number> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([REFUEL_STORE], 'readwrite');
            const store = transaction.objectStore(REFUEL_STORE);

            const refuelToSave = {
                ...refuel,
                date: refuel.date.toISOString()
            };

            const request = store.add(refuelToSave);

            request.onsuccess = () => resolve(request.result as number);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllRefuels(): Promise<Refuel[]> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([REFUEL_STORE], 'readonly');
            const store = transaction.objectStore(REFUEL_STORE);
            const request = store.getAll();

            request.onsuccess = () => {
                const results = request.result || [];
                const refuels = results.map((r: any) => ({
                    ...r,
                    date: new Date(r.date)
                }));
                refuels.sort((a, b) => b.date.getTime() - a.date.getTime());
                resolve(refuels);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async deleteRefuel(id: number): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([REFUEL_STORE], 'readwrite');
            const store = transaction.objectStore(REFUEL_STORE);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async clearAllData(): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([VEHICLE_STORE, REFUEL_STORE], 'readwrite');

            const vehicleStore = transaction.objectStore(VEHICLE_STORE);
            const refuelStore = transaction.objectStore(REFUEL_STORE);

            vehicleStore.clear();
            refuelStore.clear();

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }
}
