/*
 * File: reconciler.ts
 * File Created: Tuesday, 1st June 2021 9:01:10 pm
 * Author: richard
 */

import { generateAssetId } from "api/compatibility";
import { Files, Directory, File } from "utils/file-utils";
import globals from "utils/globals";
import { Executable, VirtualScript } from "VirtualScript";

const HttpService = game.GetService("HttpService");

/** A list of file names that should not become files. */
const RESERVED_NAMES: { [fileName: string]: boolean } = {
	"init.lua": true,
	"init.server.lua": true,
	"init.client.lua": true,
	"init.meta.json": true,
};

/** Interface for `init.meta.json` data. */
interface InstanceMetadata<T extends keyof Instances> {
	className?: T;
	properties?: Map<keyof WritableInstanceProperties<Instances[T]>, never>;
}

/** Class used to build and deploy Rostruct projects. */
export class Reconciler {
	/** An identifier for this object. */
	public readonly scope = globals.currentScope;

	/** Maps tracked VirtualScript objects to their file locations. */
	public readonly virtualScriptMap = new Map<string, VirtualScript>();

	/**
	 * Construct a new Reconciler.
	 * @param target The file the object will build.
	 */
	constructor(public readonly target: Directory) {
		globals.currentScope += 1;
	}

	/**
	 * Maps a VirtualScript object to its file location and returns it.
	 * @param obj The VirtualScript to track.
	 * @returns The original object.
	 */
	private trackScript(obj: VirtualScript): VirtualScript {
		this.virtualScriptMap.set(obj.file.location, obj);
		return obj;
	}

	/**
	 * Shorthand for creating an Instance with a name and optional parent.
	 * @param className The ClassName of the instance.
	 * @param name The name of the instance.
	 * @param parent Optional parent of the instance,
	 * @returns A new Instance.
	 */
	private make<T extends keyof CreatableInstances>(
		className: T,
		name: string,
		parent?: Instance,
	): CreatableInstances[T] {
		const instance = new Instance(className);
		instance.Name = name;
		instance.Parent = parent;
		return instance;
	}

	/**
	 * Creates an Instance using the given file information.
	 * If the file is an unknown type, returns `nil`.
	 * @param file The file to make an Instance from.
	 * @param name Optional name of the instance. Defaults to `file.name`.
	 * @param parent Optional parent of the Instance.
	 * @returns A new Instance if possible.
	 */
	private makeInstance(
		file: File<Files.FileOrUnknown>,
		name: string = file.name,
		parent?: Instance,
	): Instance | undefined {
		switch (file.extension) {
			// Script
			case "lua":
				let executable: Executable;

				if (file.type === "server.lua") executable = this.make("Script", name, parent);
				else if (file.type === "client.lua") executable = this.make("LocalScript", name, parent);
				else executable = this.make("ModuleScript", name === file.name ? file.extendedName! : name, parent);

				this.trackScript(
					new VirtualScript(executable as Executable, file as File<Files.FileType.File>, this.scope),
				);

				return executable;

			// JSON module
			case "json":
				const jsonObj = this.make("ModuleScript", name, parent);

				// Set the executor to return the decoded JSON data.
				this.trackScript(new VirtualScript(jsonObj, file as File<Files.FileType.File>, this.scope)).setExecutor(
					() => HttpService.JSONDecode(readfile(file.location)),
				);

				return jsonObj;

			// Plain text
			case "txt":
				const stringValue = this.make("StringValue", name, parent);
				stringValue.Value = readfile(file.location);
				return stringValue;

			// Binary model file
			case "rbxm":
				assert(generateAssetId, `This exploit does not support rbxasset:// generation! (${file.location})`);
				return game.GetObjects(generateAssetId(file.location))[0];

			// XML model file
			case "rbxmx":
				assert(generateAssetId, `This exploit does not support rbxasset:// generation! (${file.location})`);
				return game.GetObjects(generateAssetId(file.location))[0];

			default:
				break;
		}
	}

	/**
	 * Creates an Instance for the given folder.
	 * [Some files](https://rojo.space/docs/6.x/sync-details/#scripts) can modify the class and properties during creation.
	 * @param dir The directory to make an Instance from.
	 * @param parent Optional parent of the Instance.
	 * @returns THe instance created for the folder.
	 */
	private makeContainer(dir: Directory, parent?: Instance): Instance {
		let instance: Instance | undefined;

		// Check if the directory contains a class override.
		// https://rojo.space/docs/6.x/sync-details/#scripts
		const override = Files.locate(dir, "init.lua", "init.server.lua", "init.client.lua");
		if (override) instance = this.makeInstance(override, dir.fileName);

		// https://rojo.space/docs/6.x/sync-details/#meta-files
		const metaFile = Files.locate(dir, "init.meta.json");
		if (metaFile) {
			const metadata: InstanceMetadata<"Folder"> = HttpService.JSONDecode(readfile(metaFile.location));

			if (instance && metadata.className)
				error(`Attempt to reassign ClassName of ${dir.location} to ${metadata.className}`);

			if (!instance) instance = this.make(metadata.className || "Folder", dir.fileName);

			if (metadata.properties)
				for (const [key, value] of metadata.properties) {
					instance[key] = value;
				}
		}

		// If nothing's different, just make a folder
		if (!instance) instance = this.make("Folder", dir.fileName);

		// Scan the directory for more files
		for (const f of listfiles(dir.location)) {
			const fileName = f.match("([^/]+)$")[0] as string;

			// Make sure the file is not reserved for special use
			if (RESERVED_NAMES[fileName])
				if (isfile(f))
					this.makeInstance(
						Files.describeFile(f, this.target.location, Files.FileType.File),
						undefined,
						instance,
					);
				else if (isfolder(f)) this.makeContainer(Files.describeDirectory(f, this.target.location), instance);
		}

		instance.Parent = parent;

		return instance;
	}

	/**
	 * Generates an Instance tree using the file provided in the {@link constructor}.
	 * @param parent Optional parent of the instance tree.
	 * @returns The Instance created.
	 */
	public buildTree(parent?: Instance): Instance {
		return this.makeContainer(this.target, parent);
	}

	/**
	 * Deploys the build by executing all tracked LocalScripts on new threads.
	 * @returns
	 * An array of promises that resolve with an array containing the LocalScript and the result of executing it.
	 * The promises resolve this way so `Promise.all` calls to contain both the LocalScript and the result.
	 */
	public deploy(): Array<Promise<[LocalScript, unknown]>> {
		const newPromises = new Array<Promise<[LocalScript, unknown]>>();
		for (const [, virtualScript] of this.virtualScriptMap)
			if (virtualScript.instance.IsA("LocalScript"))
				newPromises.push(
					virtualScript.executePromise().then((result) => {
						return [virtualScript.instance as LocalScript, result];
					}),
				);
		return newPromises;
	}
}
