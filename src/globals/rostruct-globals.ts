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
}

/** Global environment reserved for Rostruct. */
export const globals: Globals = (getgenv().Rostruct as Globals) || {
	currentScope: 0,
};

getgenv().Rostruct = globals;
