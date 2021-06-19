type Replacement =
	| ((value: string) => string | number | undefined)
	| Map<string, string | number>
	| string
	| number
	| { [index: string]: string | number };

/**
 * Replaces an instance of `pattern` in `str` with `replacement`.
 * @param str The string to match against.
 * @param pattern The pattern to match.
 * @param repl What to replace the first instance of `pattern` with.
 * @returns The result of global substitution, the string matched, and the position of it.
 */
export function replace(str: string, pattern: string, repl: Replacement): [string, string, number, number] | undefined {
	const [output, count] = str.gsub(pattern, repl as Parameters<String["gsub"]>[1], 1);
	if (count > 0) {
		const [i, j] = str.find(pattern) as LuaTuple<[number, number]>;
		return [output, str.sub(i, j), i, j];
	}
}
