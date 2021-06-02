/*
 * File: loader.ts
 * File Created: Tuesday, 1st June 2021 9:07:20 pm
 * Author: richard
 */

/** Library for setting up Rostruct. */
export namespace Loader {
	/** Where Rostruct files are stored. */
	const root = "rostruct/";

	/** A list of directories to create in the Rostruct folder specified in {@link Rostruct.Config}. */
	const structure = ["dependencies/", "cache/"];

	/** A list of modules that are loaded externally and cached under `rostuct/dependencies/`. */
	export type ExternalDependencies = {
		"zzlib.lua": zzlib;
		"Promise.lua": PromiseConstructor;
	};

	const moduleUrls: { [key in keyof ExternalDependencies]: string } = {
		"zzlib.lua":
			"https://gist.githubusercontent.com/richie0866/dd558b64ba9e6da2b4e81a296ccb4d82/raw/a3fab8d1075c7477577a262ed84617d32b40f55b/zzlib.lua",
		"Promise.lua": "https://raw.githubusercontent.com/roblox-ts/roblox-ts/master/lib/Promise.lua",
	};

	const loadedModules: { [key in keyof ExternalDependencies]?: ExternalDependencies[key] } = {};

	let initialized = false;

	/** Sets up the file structure for Rostruct. */
	function init() {
		if (!isfolder(root)) makefolder(root);
		for (const path of structure) {
			if (!isfolder(root + path)) makefolder(root + path);
		}
		initialized = true;
	}

	/**
	 * Gets the value of `"rostruct/" .. file`.
	 * @param file The local path.
	 * @returns A reference to the file.
	 */
	export function getPath(file: string): string {
		if (!initialized) init();
		return root + file;
	}

	/**
	 * Installs and caches a library locally or from a site.
	 * @param fileName The name of the library.
	 * @returns The library loaded in Lua.
	 */
	function installAsync<T extends keyof ExternalDependencies>(fileName: T): ExternalDependencies[T] {
		if (loadedModules[fileName]) return loadedModules[fileName] as ExternalDependencies[T];

		const dependency = getPath("dependencies/" + fileName);
		const data = isfile(dependency) ? readfile(dependency) : game.HttpGetAsync(moduleUrls[fileName]);

		if (!isfile(dependency)) writefile(dependency, data);

		const [f, err] = loadstring(data, "=" + dependency);
		assert(f, err);
		return (loadedModules[fileName] = f() as ExternalDependencies[T]);
	}

	export const Promise = installAsync("Promise.lua");

	/**
	 * Installs or gets an external dependency from the `rostruct/dependencies/` cache.
	 * Returns the value of `loadfile("rostruct/dependencies/" ... fileName)()`
	 * @param fileName The name of the file.
	 * @returns A promise which resolves with the library loaded in Lua.
	 */
	export const install = Promise.promisify(installAsync);
}

export const Promise = Loader.Promise;
