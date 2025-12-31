import { Database } from './database.js';
import { VehicleSetup } from './components/VehicleSetup.js';
import { RefuelForm } from './components/RefuelForm.js';
import { Dashboard } from './components/Dashboard.js';
import type { Vehicle, Refuel } from './types.js';

class App {
    private db: Database;
    private mainContent: HTMLElement;

    constructor() {
        this.db = new Database();
        this.mainContent = document.getElementById('main-content')!;
    }

    async init(): Promise<void> {
        try {
            await this.db.init();
            await this.checkSetup();
            this.registerServiceWorker();
        } catch (error) {
            console.error('Erreur lors de l\'initialisation:', error);
            this.showError('Erreur lors de l\'initialisation de l\'application');
        }
    }

    private async checkSetup(): Promise<void> {
        const vehicle = await this.db.getVehicle();

        if (!vehicle) {
            this.showVehicleSetup();
        } else {
            await this.showDashboard(vehicle);
        }
    }

    private showVehicleSetup(): void {
        const vehicleSetup = new VehicleSetup(this.mainContent, async (vehicle) => {
            try {
                await this.db.saveVehicle(vehicle);
                await this.checkSetup();
            } catch (error) {
                console.error('Erreur lors de l\'enregistrement du véhicule:', error);
                this.showError('Erreur lors de l\'enregistrement du véhicule');
            }
        });

        vehicleSetup.render();
    }

    private async showDashboard(vehicle: Vehicle): Promise<void> {
        const refuels = await this.db.getAllRefuels();

        this.mainContent.innerHTML = '';

        const dashboardContainer = document.createElement('div');
        dashboardContainer.id = 'dashboard-container';
        this.mainContent.appendChild(dashboardContainer);

        const dashboard = new Dashboard(dashboardContainer, vehicle, refuels);
        dashboard.render();

        const refuelFormContainer = document.createElement('div');
        refuelFormContainer.id = 'refuel-form-container';
        this.mainContent.appendChild(refuelFormContainer);

        const refuelForm = new RefuelForm(refuelFormContainer, async (refuel) => {
            try {
                await this.db.addRefuel(refuel);
                await this.checkSetup();
            } catch (error) {
                console.error('Erreur lors de l\'ajout du ravitaillement:', error);
                this.showError('Erreur lors de l\'ajout du ravitaillement');
            }
        });

        refuelForm.render();
    }

    private showError(message: string): void {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        this.mainContent.insertBefore(errorDiv, this.mainContent.firstChild);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    private async registerServiceWorker(): Promise<void> {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker enregistré');
            } catch (error) {
                console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
            }
        }
    }
}

const app = new App();
app.init();
