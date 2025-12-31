import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';

// Create window on global if it doesn't exist (for vitest+bun)
const mockWindow: any = {
    indexedDB: new IDBFactory(),
    IDBKeyRange: IDBKeyRange
};

(global as any).window = mockWindow;

// Also expose window directly as a global variable
declare global {
    var window: typeof mockWindow;
}
globalThis.window = mockWindow;
