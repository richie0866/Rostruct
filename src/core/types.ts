/** A function that gets called when a VirtualScript is executed. */
export type Executor = (globals: VirtualEnvironment) => unknown;

/** Base environment for VirtualScript instances. */
export interface VirtualEnvironment {
	/** A reference to the script object that a file is being executed for. */
	script: LuaSourceContainer;

	/**
	 * Runs the supplied `ModuleScript` if it has not been run already, and returns what the ModuleScript returned (in both cases).
	 *
	 * If the object is bound to a `VirtualScript`, it returns what the VirtualScript returned.
	 */
	require: (obj: ModuleScript) => unknown;

	/** A reference to the path of the file that is being executed. */
	_PATH: string;

	/** A reference to the root directory `Reconciler.reify` was originally called with. */
	_ROOT: string;
}
