import { Directory } from "utils/filesystem";
import { Reconciler } from "./Reconciler";
import { BuildResult } from "./types";
import { VirtualScript } from "./VirtualScript";

/**
 * Builds the given project as a Roblox Instance tree.
 * @param target The target files to build.
 * @param parent Optional parent of the Instance tree.
 * @returns A project interface.
 */
export function buildProject(target: string, parent?: Instance): BuildResult {
	const directory = Directory(target, target);
	const reconciler = new Reconciler(directory);
	return {
		Instance: reconciler.reify(parent),
		Reconciler: reconciler,
		Location: directory.location,
	};
}

/**
 * Builds the given project and executes every tracked LocalScript.
 * @param target The target files to build.
 * @param parent Optional parent of the Instance tree.
 * @returns A project interface.
 */
export function deployProject(target: string, parent?: Instance): BuildResult {
	const directory = Directory(target, target);
	const reconciler = new Reconciler(directory);
	const instance = reconciler.reify(parent);
	return {
		Instance: instance,
		Reconciler: reconciler,
		Location: directory.location,
		RuntimeWorker: reconciler.deployWorker(),
	};
}

/**
 * Builds the given project and executes every tracked LocalScript.
 * @param target The target files to build.
 * @param parent Optional parent of the Instance tree.
 * @returns A project interface.
 */
export function requireProject(target: string, parent?: Instance): BuildResult {
	const directory = Directory(target, target);
	const reconciler = new Reconciler(directory);
	const instance = reconciler.reify(parent);
	assert(instance.IsA("LuaSourceContainer"), `Failed to require ${directory.location} (Project is not a module)`);
	return {
		Instance: instance,
		Reconciler: reconciler,
		Location: directory.location,
		RuntimeWorker: reconciler.deployWorker(),
		Module: VirtualScript.getFromInstance(instance)!.deferExecutor(),
	};
}
