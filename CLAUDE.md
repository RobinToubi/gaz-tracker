# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gaz Tracker is a Progressive Web App (PWA) for tracking fuel consumption. It's built with **vanilla TypeScript** (no frameworks like React, Vue, or Angular) and uses IndexedDB for local storage.

## Commands

```bash
# Development
bun run dev          # TypeScript watch mode
bun run build        # Compile TypeScript to JavaScript

# Testing
bun test             # Run tests with Vitest
bun test:coverage    # Generate coverage report

# Serving
bun run serve        # Serve application locally
```

## Architecture

### Component Pattern

This codebase uses a **class-based component architecture** without any framework:

- Components are TypeScript classes that manage their own rendering
- Each component receives:
  - A container `HTMLElement` for rendering
  - A callback function for handling user actions
- Components render by setting `innerHTML` directly
- No virtual DOM or reactive state management

Example component structure:
```typescript
export class MyComponent {
    constructor(
        private container: HTMLElement,
        private onAction: (data: SomeType) => Promise<void>
    ) {}

    render(): void {
        this.container.innerHTML = `...`;
        // Attach event listeners after setting innerHTML
    }
}
```

### Application Flow

1. **App.ts** - Main entry point
   - Initializes Database
   - Checks if vehicle is configured
   - Routes to VehicleSetup or Dashboard

2. **Database.ts** - IndexedDB wrapper service
   - Two object stores: `vehicle` and `refuels`
   - All operations return Promises
   - Stores dates as ISO strings, converts to Date objects on retrieval

3. **Components**
   - **VehicleSetup**: Initial vehicle configuration form
   - **Dashboard**: Statistics display and refuel history list
   - **RefuelForm**: Form for adding new refuels

4. **Statistics Calculation** (in Dashboard.ts:105-141)
   - Average consumption calculated from total distance (max odometer - min odometer)
   - Requires at least 2 refuels to calculate consumption

### Module System

**CRITICAL**: This project uses ES modules. All imports must use `.js` extensions, even when importing from `.ts` files:

```typescript
// ✅ Correct
import { Database } from './database.js';
import type { Vehicle } from './types.js';

// ❌ Wrong
import { Database } from './database';
import { Database } from './database.ts';
```

TypeScript compiles to JavaScript in the `dist/` folder, and the runtime expects `.js` extensions.

## Testing

- Framework: **Vitest** with jsdom environment
- IndexedDB: Mocked with `fake-indexeddb` (see [src/tests/setup.ts](src/tests/setup.ts))
- Setup file configures mock `window` and `indexedDB` globals for tests
- Test files must not be included in tsconfig (already excluded)
- Run tests with `bun test`

To test Database operations:
```typescript
import { Database } from '../database.js';
// Tests automatically use fake-indexeddb via setup.ts
```

## PWA Features

- **Service Worker**: [sw.js](sw.js) handles offline caching
- **Manifest**: [manifest.json](manifest.json) configures PWA metadata
- Registered in [src/app.ts](src/app.ts:91-99)
- Works offline after first load

## Data Model

See [src/types.ts](src/types.ts) for complete type definitions:

- **Vehicle**: model, capacity (tank size in liters)
- **Refuel**: date, liters, price (total), odometer (km)
- **Statistics**: Calculated on-the-fly, not stored

The application stores only one vehicle at a time (uses first record from vehicle store).
