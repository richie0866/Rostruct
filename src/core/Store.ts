type Store = Map<unknown, unknown>;
type Stores = Map<string, Store>;

// Ensures that stores persist between sessions.
const stores =
	getgenv().RostructStore !== undefined
		? (getgenv().RostructStore as Stores)
		: (getgenv().RostructStore = new Map<string, Store>());

/** Stores persistent data between sessions. */
export const Store = {
	/**
	 * Lazily creates a Map object. The map is shared between all sessions of
	 * the current game.
	 * @param name The name of the store.
	 * @returns A Map object.
	 */
	getStore<K, V>(storeName: string): Map<K, V> {
		if (stores.has(storeName)) return stores.get(storeName) as Map<K, V>;
		const store = new Map<K, V>();
		stores.set(storeName, store);
		return store;
	},
} as const;
