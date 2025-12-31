import type { Vehicle } from '../types.js';

export class VehicleSetup {
    private container: HTMLElement;
    private onSubmit: (vehicle: Vehicle) => void;

    constructor(container: HTMLElement, onSubmit: (vehicle: Vehicle) => void) {
        this.container = container;
        this.onSubmit = onSubmit;
    }

    render(): void {
        this.container.innerHTML = `
            <div class="card">
                <h2>Configuration du véhicule</h2>
                <form id="vehicle-form">
                    <div class="form-group">
                        <label for="model">Modèle du véhicule</label>
                        <input
                            type="text"
                            id="model"
                            name="model"
                            required
                            placeholder="ex: Renault Clio"
                            autocomplete="off"
                        >
                    </div>
                    <div class="form-group">
                        <label for="capacity">Capacité du réservoir (L)</label>
                        <input
                            type="number"
                            id="capacity"
                            name="capacity"
                            required
                            min="1"
                            step="1"
                            placeholder="ex: 50"
                        >
                    </div>
                    <button type="submit">Enregistrer le véhicule</button>
                </form>
            </div>
        `;

        this.attachEventListeners();
    }

    private attachEventListeners(): void {
        const form = this.container.querySelector('#vehicle-form') as HTMLFormElement;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const vehicle: Vehicle = {
                model: formData.get('model') as string,
                capacity: parseFloat(formData.get('capacity') as string)
            };

            this.onSubmit(vehicle);
        });
    }
}
