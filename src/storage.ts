/*
 * File: loader.ts
 * File Created: Tuesday, 1st June 2021 9:07:20 pm
 * Author: richard
 * Description: Library for setting up Rostruct
 */

import { Files } from "utils/file-utils";

/** A list of modules that are stored externally and cached. */
export type ExternalDependencies = {
	"zzlib.lua": zzlib;
	"Promise.lua": PromiseConstructor;
};

/** Maps a list of files that handle Rostruct file storage. */
export const storageMap = {
	"rostruct/": "",
	"rostruct/cache/": "",
	"rostruct/cache/modules/": "",
	"rostruct/cache/repos/": "",
	"rostruct/cache/repo_tags.json": "{}",
} as const;

/** Map module names to their source URL. */
const moduleUrls: { [moduleName in keyof ExternalDependencies]: string } = {
	"zzlib.lua":
		"https://gist.githubusercontent.com/richie0866/dd558b64ba9e6da2b4e81a296ccb4d82/raw/a3fab8d1075c7477577a262ed84617d32b40f55b/zzlib.lua",
	"Promise.lua": "https://raw.githubusercontent.com/roblox-ts/roblox-ts/master/lib/Promise.lua",
} as const;

/** Store required module names. */
const modules: {
	[moduleName in keyof ExternalDependencies]?: ExternalDependencies[moduleName];
} = {};

/**
 * Gets the value of `dir .. file`. Used for autocompletes.
 * @param dir The directory to index.
 * @param file The local path.
 * @returns A reference to the file.
 */
export function getPath(dir: keyof typeof storageMap, file: string): string {
	return dir + file;
}

/**
 * Installs and caches a library locally or from a site.
 * @param fileName The name of the library.
 * @returns The library loaded in Lua.
 */
function loadModuleAsync<T extends keyof ExternalDependencies>(fileName: T): ExternalDependencies[T] {
	if (modules[fileName]) return modules[fileName] as ExternalDependencies[T];

	const dependency = getPath("rostruct/cache/modules/", fileName);
	const data = isfile(dependency) ? readfile(dependency) : game.HttpGetAsync(moduleUrls[fileName]);

	if (!isfile(dependency)) writefile(dependency, data);

	const [f, err] = loadstring(data, "=" + dependency);
	assert(f, err);
	return (modules[fileName] = f() as ExternalDependencies[T]);
}

// Set up the file structure for Rostruct.
Files.makeFiles(Files.fileMapToFileArray(storageMap));

export const Promise = loadModuleAsync("Promise.lua");

/**
 * Installs or gets an external dependency from the Rostruct cache.
 * Returns the value of `loadfile("rostruct/cache/modules/" ... fileName)()`
 * @param fileName The name of the file.
 * @returns A promise which resolves with the library loaded in Lua.
 */
export const loadModule = Promise.promisify(loadModuleAsync);
