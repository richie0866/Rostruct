import { makeFiles } from "utils/file-utils";

/** Assigns common folders to a keyword. */
const FILES = {
	ROOT: "rostruct/",
	CACHE: "rostruct/cache/",
	RELEASE_CACHE: "rostruct/cache/releases/",
	RELEASE_TAGS: "rostruct/cache/release_tags.json",
} as const;

/** Gets a Rostruct path from a keyword. */
export function getRostructPath<T extends keyof typeof FILES>(keyword: T): typeof FILES[T] {
	return FILES[keyword];
}

/** Sets up core files for Rostruct. */
export function bootstrap() {
	makeFiles([
		["rostruct/cache/releases/", ""],
		["rostruct/cache/release_tags.json", "{}"],
	]);
}
