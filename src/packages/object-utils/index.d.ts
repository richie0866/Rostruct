interface ObjectConstructor {
	/**
	 * Copy the values of all of the enumerable own properties from one or more source objects to a target object.
	 * Returns the target object.
	 */
	assign<A, B>(this: void, target: A, source: B): A & B;
	assign<A, B, C>(this: void, target: A, source1: B, source2: C): A & B & C;
	assign<A, B, C, D>(this: void, target: A, source1: B, source2: C, source3: D): A & B & C & D;
	assign<A, B, C, D, E>(this: void, target: A, source1: B, source2: C, source3: D, source4: E): A & B & C & D & E;
	assign<A, B, C, D, E, F>(
		this: void,
		target: A,
		source1: B,
		source2: C,
		source3: D,
		source4: E,
		source5: F,
	): A & B & C & D & E & F;
	assign(this: void, target: object, ...sources: Array<any>): any;

	/**
	 * Returns the names of the enumerable properties and methods of an object.
	 * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
	 */
	keys<T>(this: void, o: ReadonlyArray<T>): Array<number>;
	keys<T>(this: void, o: ReadonlySet<T>): Array<T>;
	keys<K, V>(this: void, o: ReadonlyMap<K, V>): Array<K>;
	keys<T extends object>(this: void, o: T): keyof T extends never ? Array<unknown> : Array<keyof T>;

	/**
	 * Returns an array of values of the enumerable properties of an object
	 * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
	 */
	values<T>(this: void, o: ReadonlyArray<T>): Array<NonNullable<T>>;
	values<T>(this: void, o: ReadonlySet<T>): Array<true>;
	values<K, V>(this: void, o: ReadonlyMap<K, V>): Array<NonNullable<V>>;
	values<T extends object>(this: void, o: T): keyof T extends never ? Array<unknown> : Array<NonNullable<T[keyof T]>>;

	/**
	 * Returns an array of key/values of the enumerable properties of an object
	 * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
	 */
	entries<T>(this: void, o: ReadonlyArray<T>): Array<[number, NonNullable<T>]>;
	entries<T>(this: void, o: ReadonlySet<T>): Array<[T, true]>;
	entries<K, V>(this: void, o: ReadonlyMap<K, V>): Array<[K, NonNullable<V>]>;
	entries<T extends object>(
		this: void,
		o: T,
	): keyof T extends never ? Array<[unknown, unknown]> : Array<[keyof T, NonNullable<T[keyof T]>]>;

	/** Creates an object from a set of entries */
	fromEntries<P extends readonly [string | number | symbol, unknown]>(
		this: void,
		i: ReadonlyArray<P>,
	): Reconstruct<
		UnionToIntersection<
			P extends unknown
				? {
						[k in P[0]]: P[1];
				  }
				: never
		>
	>;

	/**
	 * Returns true if empty, otherwise false.
	 */
	isEmpty(this: void, o: object): boolean;

	/**
	 * Returns a shallow copy of the object
	 */
	copy<T extends object>(this: void, o: T): T;

	/**
	 * Returns a deep copy of the object
	 */
	deepCopy<T extends object>(this: void, o: T): T;

	/**
	 * Returns true if
	 * - each member of `a` equals each member of `b`
	 * - `b` has no members that do not exist in `a`.
	 *
	 * Searches recursively.
	 */
	deepEquals(this: void, a: object, b: object): boolean;
}

declare const Object: ObjectConstructor;

export = Object;
