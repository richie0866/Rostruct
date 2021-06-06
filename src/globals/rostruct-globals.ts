/*
 * File: reserved.ts
 * File Created: Tuesday, 1st June 2021 8:58:07 pm
 * Author: richard
 */

import { VirtualEnv } from "core";

/** Global environment reserved for Rostruct. */
interface Globals {
	/** A number used to identify Reconciler objects. */
	currentScope: number;

	/** List of environments for running VirtualScripts. */
	environments: Map<string, VirtualEnv>;
}

/** Global environment reserved for Rostruct. */
export const globals: Globals = (getgenv().Rostruct as Globals) || {
	currentScope: 0,
	environments: new Map<string, VirtualEnv>(),
};

getgenv().Rostruct = globals;
