import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';

// Create window on global if it doesn't exist (for vitest+bun)
const mockWindow = {
    indexedDB: new IDBFactory(),
    IDBKeyRange: IDBKeyRange
};

(global as any).window = mockWindow;
(globalThis as any).window = mockWindow;
