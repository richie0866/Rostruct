import { Reconciler } from "./Reconciler";

/** A function that gets called when a VirtualScript is executed. */
export type Executor = () => unknown;

/** Base environment for VirtualScript instances. */
export interface VirtualEnv {
	/** A reference to the script object that a file is being executed for. */
	script: LuaSourceContainer;

	/**
	 * Runs the supplied `ModuleScript` if it has not been run already, and returns what the ModuleScript returned (in both cases).
	 *
	 * If the module is attached to a `VirtualScript` object, it returns what the VirtualScript returned.
	 */
	require: (obj: ModuleScript) => unknown;

	/** A reference to the path of the file that is being executed. */
	_PATH: string;

	/** A reference to the root directory `Reconciler.reify` was originally called with. */
	_ROOT: string;
}

/** Stores the results of project building functions. */
export interface BuildResult {
	/** The Instance tree built. */
	Instance: Instance;

	/** The file location of the project. */
	Location: string;

	/** A promise that resolves once all scripts finish executing, returning an array of every script run. */
	RuntimeWorker?: Promise<LocalScript[]>;

	/** A promise which resolves with what the module returned. */
	Module?: Promise<unknown>;
}

/** Information about the release being downloaded. */
export interface DownloadResult {
	/** A reference to where the data was extracted to. */
	Location: string;

	/** The tag of the release that was downloaded. */
	Tag: string;

	/** Whether the cache was updated to include this download. */
	Updated: boolean;
}

/** Prevent the transpiled Lua code from returning nil! */
export const _ = undefined;
