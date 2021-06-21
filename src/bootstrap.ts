import { makeUtils } from "utils/file-utils";

/** Assigns common folders to a keyword. */
const Shortcut = {
	ROOT: "rostruct/",
	CACHE: "rostruct/cache/",
	RELEASE_CACHE: "rostruct/cache/releases/",
	RELEASE_TAGS: "rostruct/cache/release_tags.json",
} as const;

type Shortcut = typeof Shortcut;

/** Gets a Rostruct path from a keyword. */
export const getRostructPath = <T extends keyof Shortcut>(keyword: T): Shortcut[T] => Shortcut[keyword];

/** Sets up core files for Rostruct. */
export const bootstrap = () =>
	makeUtils.makeFiles([
		["rostruct/cache/releases/", ""],
		["rostruct/cache/release_tags.json", "{}"],
	]);
