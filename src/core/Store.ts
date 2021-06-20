export type Store<K = unknown, V = unknown> = Map<K, V>;

const globalStore = (getgenv().RostructStore as Map<string, Store>) ?? new Map<string, Store>();
if (getgenv().RostructStore === undefined) {
	getgenv().RostructStore = globalStore;
}

interface StoreConstructor {
	getStore<K, V>(name: string): Store<K, V>;
}

/** Stores persistent data in the global environment. */
export const Store: StoreConstructor = {
	/** Creates a new Store object. */
	getStore<K, V>(name: string) {
		const store = globalStore.get(name);
		if (store) return store as Store<K, V>;

		const newStore = new Map<K, V>();

		globalStore.set(name, newStore);

		return newStore;
	},
};
