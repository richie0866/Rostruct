/*
 * File: virtualScript.ts
 * File Created: Tuesday, 1st June 2021 8:58:51 pm
 * Author: richard
 */

import { Promise } from "storage";
import { Files, File } from "utils/file-utils";
import globals from "utils/globals";
import Object from "@rbxts/object-utils";

const HttpService = game.GetService("HttpService");

/** A script that can be created by Rostruct. */
export type Executable = ModuleScript | LocalScript | Script;
export type Executor = () => unknown;
export type EnvironmentKey = "script" | "require" | "_PATH" | "_ROOT";

/** Base environment for VirtualScript instances. */
export interface Environment {
	script: Executable;
	require: (obj: ModuleScript) => unknown;
	_PATH: string;
	_ROOT: string;
}

/** Maps VirtualScripts to their instances. */
const virtualScriptsByInstance = new Map<Executable, VirtualScript>();

/**
 * Requires a `ModuleScript`. If the module has a `VirtualScript` counterparg, this function will call `virtualScript.execute` and return the results.
 * @param obj The ModuleScript to require.
 * @returns The required module.
 */
export function loadVirtualScript(obj: ModuleScript): VirtualScript | unknown {
	const virtualScript = virtualScriptsByInstance.get(obj);
	if (virtualScript) return virtualScript.execute();
	else return require(obj);
}

/** Class used to connect a file to virtual code. */
export class VirtualScript {
	/**
	 * Returns the `VirtualScript` instance that was created for the given `Instance`.
	 * @param obj The Instance to search by.
	 * @returns The corresponding VirtualScript.
	 */
	public static getFromInstance(obj: Executable): VirtualScript | undefined {
		return virtualScriptsByInstance.get(obj);
	}

	/** An identifier used to store the object in `virtualScriptsByInstance`. */
	public readonly id: string;

	/** The Instance that represents this object used for globals. */
	public readonly instance: Executable;

	/** The file this object extends. */
	public readonly file: File<Files.FileType.File>;

	/** The scope of the Reconciler that created this object. Used to prevent overlapping globals when two Reconcilers are created. */
	private readonly scope: number;

	/** The function to be called at runtime when the script runs or gets required. */
	private executor?: Executor;

	/** The executor's return value after being called the first time. ModuleScripts must have a non-nil result. */
	private result?: unknown;

	/** Whether the executor has already been called. */
	private isDone = false;

	/** A custom environment for the object. */
	private readonly env: Environment;

	/** Construct a new VirtualScript. */
	constructor(obj: Executable, file: File<Files.FileType.File>, scope: number) {
		assert(file.origin, `VirtualScript file must have an origin (${file.location})`);

		this.id = `VirtualScript-${HttpService.GenerateGUID(false)}`;
		this.instance = obj;
		this.file = file;
		this.scope = scope;

		this.env = {
			script: obj,
			require: (obj: ModuleScript) => loadVirtualScript(obj),
			_PATH: file.location,
			_ROOT: file.origin,
		};

		globals.environments.set(`${scope}-${this.id}`, this.env);
		virtualScriptsByInstance.set(obj, this);
	}

	/**
	 * Generates a source script with globals defined as local variables.
	 * @returns The source of the VirtualScript.
	 */
	private getSource(): string {
		let header = `local _ENV = getgenv()._ROSTRUCT.environments['${this.scope}-${this.id}']; `;

		// Declare locals at the top of the script:
		for (const k of Object.keys(this.env)) {
			header += `local ${k} = _ENV['${k}']; `;
		}

		return header + readfile(this.file.location);
	}

	/**
	 * Sets the executor function.
	 * @param exec The function to call on execution.
	 */
	public setExecutor(exec: Executor) {
		this.executor = exec;
		this.result = undefined;
	}

	/**
	 * Gets or creates a new executor function
	 * @returns The function to call on execution.
	 */
	public createExecutor(): Executor {
		if (this.executor) return this.executor;
		const [f, err] = loadstring(this.getSource(), "=" + this.file.location);
		assert(f, err);
		return (this.executor = f);
	}

	/**
	 * Runs the executor function if not already run and returns results.
	 * @returns The value returned by the executor.
	 */
	public execute(): ReturnType<Executor> {
		if (this.isDone) return this.result;

		const result = this.createExecutor()();

		// Modules must return a value.
		if (this.instance.IsA("ModuleScript"))
			assert(result, `Module '${this.file.location}' did not return any value`);

		this.isDone = true;

		return (this.result = result);
	}

	/**
	 * Runs the executor function if not already run and returns results.
	 * @returns A promise which resolves with the value returned by the executor.
	 */
	public executePromise(): Promise<ReturnType<Executor>> {
		return Promise.defer((resolve) => resolve(this.execute())).timeout(
			30,
			`Script ${this.file.location} reached execution timeout! Try not to yield the main thread in LocalScripts.`,
		);
	}
}
