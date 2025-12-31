import type { Refuel } from '../types.js';

export class RefuelForm {
    private container: HTMLElement;
    private onSubmit: (refuel: Refuel) => void;

    constructor(container: HTMLElement, onSubmit: (refuel: Refuel) => void) {
        this.container = container;
        this.onSubmit = onSubmit;
    }

    render(): void {
        const today = new Date().toISOString().split('T')[0];

        this.container.innerHTML = `
            <div class="card">
                <h2>Nouveau ravitaillement</h2>
                <form id="refuel-form">
                    <div class="form-group">
                        <label for="date">Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            required
                            value="${today}"
                        >
                    </div>
                    <div class="form-group">
                        <label for="liters">Litres</label>
                        <input
                            type="number"
                            id="liters"
                            name="liters"
                            required
                            min="0.01"
                            step="0.01"
                            placeholder="ex: 45.5"
                        >
                    </div>
                    <div class="form-group">
                        <label for="price">Prix total (€)</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            required
                            min="0.01"
                            step="0.01"
                            placeholder="ex: 75.50"
                        >
                    </div>
                    <div class="form-group">
                        <label for="odometer">Kilométrage</label>
                        <input
                            type="number"
                            id="odometer"
                            name="odometer"
                            required
                            min="0"
                            step="1"
                            placeholder="ex: 12345"
                        >
                    </div>
                    <button type="submit">Enregistrer</button>
                </form>
            </div>
        `;

        this.attachEventListeners();
    }

    private attachEventListeners(): void {
        const form = this.container.querySelector('#refuel-form') as HTMLFormElement;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const refuel: Refuel = {
                date: new Date(formData.get('date') as string),
                liters: parseFloat(formData.get('liters') as string),
                price: parseFloat(formData.get('price') as string),
                odometer: parseInt(formData.get('odometer') as string, 10)
            };

            this.onSubmit(refuel);
            form.reset();
            (form.querySelector('#date') as HTMLInputElement).value = new Date().toISOString().split('T')[0];
        });
    }
}
