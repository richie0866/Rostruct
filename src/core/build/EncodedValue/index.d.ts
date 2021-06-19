declare namespace EncodedValue {
	/**
	 * Constructs a Roblox data type from the property value.
	 * @param dataType Typically the result of `typeof()`.
	 * @param encodedValue The encoded value to construct the type with.
	 */
	export function decode(
		dataType: string,
		encodedValue: EncodedValue,
	): LuaTuple<[true, CheckableTypes] | [false, string]>;

	/**
	 * Sets a Roblox object's `property` to the encoded value.
	 *
	 * Decodes the encoded value with `typeof(obj[property])`.
	 *
	 * @param obj The object to write to.
	 * @param property The name of the property.
	 * @param encodedValue The encoded value to pass to `decode()`.
	 */
	export function setProperty<T extends Instance>(
		obj: T,
		property: keyof WritableInstanceProperties<T>,
		encodedValue: EncodedValue,
	): void;

	/**
	 * Calls `setProperty()` on `obj` with every key-value pair
	 * of `properties`.
	 * @param obj The object to write to.
	 * @param properties An object mapping property names to encoded values.
	 */
	export function setProperties<T extends Instance>(
		obj: T,
		properties: Map<keyof WritableInstanceProperties<T>, EncodedValue>,
	): void;

	export function setModelProperties<T extends Instance>(
		obj: T,
		properties: Map<keyof WritableInstanceProperties<T>, unknown>,
	): void;
}

type EncodedValue = CheckablePrimitives | CheckablePrimitives[];

export = EncodedValue;
