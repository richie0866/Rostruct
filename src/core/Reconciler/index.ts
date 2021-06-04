/*
 * File: index.ts
 * File Created: Friday, 4th June 2021 1:52:37 am
 * Author: richard
 * Description: Transforms files into Roblox objects.
 */

import transformDirectory from "core/Reconciler/transformDirectory";
import { VirtualScript } from "core/VirtualScript";
import * as fileUtils from "utils/file-utils";
import globals from "utils/globals";
import Promise from "packages/Promise";

/** Class used to transform files into a Roblox instance tree. */
export class Reconciler {
	/** An identifier used to group VirtualScripts. */
	readonly scope = globals.currentScope++;

	/** Creates a new Reconciler object. */
	constructor(
		/** The directory to turn into an instance tree. */
		readonly target: fileUtils.Directory,
	) {}

	/**
	 * Generates an Instance tree using the file provided in the {@link constructor}.
	 * @param parent Optional parent of the instance tree.
	 * @returns The Instance created.
	 */
	reify(parent?: Instance): Instance {
		const directory = transformDirectory(this.target, this.scope);
		directory.Parent = parent;
		return directory;
	}

	/**
	 * Deploys the build by executing all LocalScripts on this `scope` on new threads.
	 * @returns
	 * A promise that resolves once all scripts finish executing, returning an array of every script run.
	 * If one script throws an error, the entire promise will cancel.
	 */
	deployWorker(): Promise<LocalScript[]> {
		const runtimeJobs: Promise<LocalScript>[] = [];
		const virtualScripts = VirtualScript.getVirtualScriptsOfScope(this.scope);

		assert(virtualScripts, "Cannot deploy project with no scripts!");

		for (const v of virtualScripts)
			if (v.instance.IsA("LocalScript"))
				runtimeJobs.push(v.deferExecutor().andThen(() => v.instance as LocalScript));

		// Define as constant because the implementation of Roblox 'Promise.all' is faulty
		const runtimeWorker = Promise.all(runtimeJobs);

		return runtimeWorker as Promise<LocalScript[]>;
	}
}
