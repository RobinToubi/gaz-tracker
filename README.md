# Gaz Tracker

Application web PWA pour tracer votre consommation de carburant.

## Fonctionnalités

- Configuration initiale du véhicule (modèle et capacité du réservoir)
- Ajout de ravitaillements avec:
  - Date
  - Nombre de litres
  - Prix total
  - Kilométrage
- Statistiques automatiques:
  - Consommation moyenne (L/100km)
  - Prix moyen au litre
  - Total litres consommés
  - Coût total
- Historique complet des ravitaillements
- PWA installable sur mobile
- Stockage local avec IndexedDB
- Fonctionne hors ligne

## Technologies

- TypeScript (sans framework)
- IndexedDB pour le stockage
- PWA (Progressive Web App)
- Design mobile-first
- Tests avec Vitest

## Installation

1. Installer les dépendances:
```bash
bun install
```

2. Compiler le TypeScript:
```bash
bun run build
```

3. Lancer un serveur local:
```bash
bun run serve
```

4. Ouvrir l'application dans votre navigateur à l'adresse indiquée (généralement http://localhost:3000)

## Développement

Pour compiler en mode watch:
```bash
bun run dev
```

Pour lancer les tests:
```bash
bun test
```

Pour générer un rapport de couverture:
```bash
bun run test:coverage
```

## Utilisation

1. **Première utilisation**: Configurez votre véhicule en renseignant le modèle et la capacité du réservoir

2. **Ajouter un ravitaillement**: Utilisez le formulaire pour enregistrer chaque plein avec:
   - La date du ravitaillement
   - Le nombre de litres ajoutés
   - Le prix payé
   - Le kilométrage actuel du véhicule

3. **Consulter les statistiques**: Les statistiques sont calculées automatiquement et affichées en haut de l'écran

## Structure du projet

```
gaz-tracker/
├── src/
│   ├── components/
│   │   ├── Dashboard.ts       # Affichage des stats et historique
│   │   ├── RefuelForm.ts      # Formulaire de ravitaillement
│   │   └── VehicleSetup.ts    # Configuration du véhicule
│   ├── tests/
│   │   ├── database.test.ts   # Tests du service database
│   │   ├── statistics.test.ts # Tests du calcul des stats
│   │   └── setup.ts           # Configuration des tests
│   ├── app.ts                 # Point d'entrée de l'application
│   ├── database.ts            # Service IndexedDB
│   └── types.ts               # Types TypeScript
├── dist/                      # Fichiers compilés
├── index.html                 # Page principale
├── styles.css                 # Styles CSS
├── manifest.json              # Configuration PWA
├── sw.js                      # Service Worker
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

## Installation sur mobile

1. Ouvrir l'application dans votre navigateur mobile
2. Dans le menu du navigateur, sélectionner "Ajouter à l'écran d'accueil"
3. L'application apparaîtra comme une app native sur votre téléphone
4. Elle fonctionnera même hors ligne une fois installée

## Notes

- Les données sont stockées localement dans votre navigateur
- Aucune connexion internet n'est requise après le premier chargement
- La consommation moyenne est calculée sur la distance totale parcourue entre le premier et le dernier ravitaillement
