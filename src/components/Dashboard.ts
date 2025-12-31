import type { Vehicle, Refuel, Statistics } from '../types.js';

export class Dashboard {
    private container: HTMLElement;
    private vehicle: Vehicle;
    private refuels: Refuel[];

    constructor(container: HTMLElement, vehicle: Vehicle, refuels: Refuel[]) {
        this.container = container;
        this.vehicle = vehicle;
        this.refuels = refuels;
    }

    render(): void {
        const stats = this.calculateStatistics();

        this.container.innerHTML = `
            <div class="vehicle-info">
                <div class="vehicle-model">${this.vehicle.model}</div>
                <div class="vehicle-capacity">Réservoir: ${this.vehicle.capacity}L</div>
            </div>

            ${this.refuels.length > 0 ? this.renderStats(stats) : ''}

            <div class="card">
                <h2>Historique des ravitaillements</h2>
                ${this.refuels.length > 0 ? this.renderRefuelList() : this.renderEmptyState()}
            </div>
        `;
    }

    private renderStats(stats: Statistics): string {
        return `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">Consommation</div>
                    <div class="stat-value">
                        ${stats.averageConsumption.toFixed(2)}
                        <span class="stat-unit">L/100km</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Prix moyen</div>
                    <div class="stat-value">
                        ${stats.averagePricePerLiter.toFixed(2)}
                        <span class="stat-unit">€/L</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Total litres</div>
                    <div class="stat-value">
                        ${stats.totalLiters.toFixed(1)}
                        <span class="stat-unit">L</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Coût total</div>
                    <div class="stat-value">
                        ${stats.totalCost.toFixed(2)}
                        <span class="stat-unit">€</span>
                    </div>
                </div>
            </div>
        `;
    }

    private renderRefuelList(): string {
        return `
            <ul class="refuel-list">
                ${this.refuels.map(refuel => this.renderRefuelItem(refuel)).join('')}
            </ul>
        `;
    }

    private renderRefuelItem(refuel: Refuel): string {
        const pricePerLiter = refuel.price / refuel.liters;
        const dateStr = refuel.date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        return `
            <li class="refuel-item">
                <div class="refuel-info">
                    <div class="refuel-date">${dateStr}</div>
                    <div class="refuel-details">
                        ${refuel.liters.toFixed(2)}L • ${pricePerLiter.toFixed(2)}€/L • ${refuel.odometer}km
                    </div>
                </div>
                <div class="refuel-price">${refuel.price.toFixed(2)}€</div>
            </li>
        `;
    }

    private renderEmptyState(): string {
        return `
            <div class="empty-state">
                <p>Aucun ravitaillement enregistré</p>
                <p>Ajoutez votre premier ravitaillement ci-dessous</p>
            </div>
        `;
    }

    private calculateStatistics(): Statistics {
        if (this.refuels.length === 0) {
            return {
                averageConsumption: 0,
                totalLiters: 0,
                totalCost: 0,
                averagePricePerLiter: 0,
                totalDistance: 0
            };
        }

        const totalLiters = this.refuels.reduce((sum, r) => sum + r.liters, 0);
        const totalCost = this.refuels.reduce((sum, r) => sum + r.price, 0);
        const averagePricePerLiter = totalCost / totalLiters;

        let averageConsumption = 0;
        let totalDistance = 0;

        if (this.refuels.length >= 2) {
            const sortedRefuels = [...this.refuels].sort((a, b) => a.odometer - b.odometer);
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
}
