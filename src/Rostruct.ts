import { zzlib, ZipData } from "../types/zzlib";
import { ReleaseInfo } from "../types/ReleaseInfo";

/**
 * # Rostruct
 * Rostruct is a [Promise](https://eryn.io/roblox-lua-promise/)-based development utility written using [roblox-ts](https://roblox-ts.com/).
 * This module allows you to build and deploy modular projects as Roblox instances in your
 * exploit of choice. The file conversion model is nearly identical to [Rojo's](https://github.com/rojo-rbx/rojo#readme).
 *
 * ## Features
 * Rostruct enables:
 * * Quality debugging and maintainability from modular programming
 * * Deploying projects {@link GitFetch directly from Github}
 * * Loading ``rbxm`` and ``rbxmx`` models into your project (superseding GetObjects)
 * * Back-to-back deploying to Roblox and testing in Roblox Studio with Rojo or another tool
 *
 * [Why Rostruct?](https://v3rmillion.net/showthread.php?tid=1081675)
 *
 * @author 0866
 */
namespace Rostruct {
	/** Configuration settings for the current Rostruct build. */
	export const Config = {
		/** Whether the project builder will scan the project for a `src/` or `lib/` directory. */
		prioritizeSource: true,
	};

	/** Stores the result of {@link Rostruct.Build} and similar functions. */
	export interface Project {
		/** The Instance tree built. */
		Instance: Instance;

		/** The {@link Reconciler} object. */
		Reconciler: Reconciler;

		/** The file location of the project. May differ from the path provided to the function. */
		Path: string;

		/**
		 * An array of promises that resolve with LocalScripts and the result of executing them.
		 * @example
		 * ```lua
		 * local project = Rostruct.Deploy("MyProjects/ESP")
		 * Promise.all(project.RuntimePromises)
		 * 	.andThen(function(scriptsAndResults)
		 * 		print("Scripts executed: " .. #scriptsAndResults)
		 * 	end)
		 * ```
		 */
		RuntimePromises?: Array<Promise<[LocalScript, unknown]>>;

		/**
		 * A promise which resolves with the module required. Present when using {@link Rostruct.Require}.
		 * This function uses Promises for control over errors and yielding.
		 * @example
		 * ```lua
		 * local project = Rostruct.Require("MyProjects/UILibrary")
		 * local UILibrary = project.RequirePromise:expect()
		 * UILibrary.doThings()
		 * ```
		 */
		RequirePromise?: Promise<unknown>;
	}

	/**
	 * Builds the given project as a Roblox Instance tree.
	 * @param target The target files to build.
	 * @param parent Optional parent of the Instance tree.
	 * @returns A project interface.
	 */
	export function Build(target: string, parent?: Instance): Project {
		const targetFile = new FileDescriptor(target, target);
		const projectFile =
			targetFile.isFolder && Config.prioritizeSource
				? targetFile.find("src") || targetFile.find("lib") || targetFile
				: targetFile;
		const reconciler = new Reconciler(projectFile);
		return {
			Instance: reconciler.buildTree(targetFile.name, parent),
			Reconciler: reconciler,
			Path: projectFile.path,
		};
	}

	/**
	 * Builds the given project and executes every tracked LocalScript.
	 * The result includes the {@link Project.RuntimePromises} fields.
	 * @param target The target files to build.
	 * @param parent Optional parent of the Instance tree.
	 * @returns A project interface.
	 * @example
	 * ```lua
	 * local project = Rostruct.Deploy("MyProjects/ESP")
	 * Promise.all(project.RuntimePromises)
	 * 	.andThen(function(scriptsAndResults)
	 * 		print("Scripts executed: " .. #scriptsAndResults)
	 * 	end)
	 * ```
	 */
	export function Deploy(target: string, parent?: Instance): Project {
		const project = Rostruct.Build(target, parent);
		project.RuntimePromises = project.Reconciler.deploy();
		return project;
	}

	/**
	 * Builds the given project and executes every tracked LocalScript.
	 * The result includes the {@link Project.RuntimePromises} and {@link Project.RequirePromise} fields.
	 * @param target The target files to build.
	 * @param parent Optional parent of the Instance tree.
	 * @returns A project interface.
	 * @example
	 * ```lua
	 * local project = Rostruct.Require("MyProjects/UILibrary")
	 * local UILibrary = project.RequirePromise:expect()
	 * UILibrary.doThings()
	 * ```
	 */
	export function Require(target: string, parent?: Instance): Project {
		const project = Rostruct.Build(target, parent);
		assert(project.Instance.IsA("ModuleScript"), `Object at path ${project.Path} must be a module`);
		project.RuntimePromises = project.Reconciler.deploy();
		project.RequirePromise = VirtualScript.fromInstance(project.Instance)!.executePromise();
		return project;
	}

	/**
	 * Returns information about the latest release of the repository.
	 * Can be paired with the second return value of {@link GitFetch} to get information about an update's changes.
	 * @param user The owner of this repository.
	 * @param repo The name of this repository.
	 * @returns Information about the latest release of the repository.
	 * @example
	 * ```lua
	 * local releaseInfo = Rostruct.GetLatestReleaseInfo("Roblox", "roact"):expect()
	 * print(releaseInfo.tag_name)
	 * ```
	 */
	export function GetLatestReleaseInfo(user: string, repo: string): Promise<ReleaseInfo> {
		return new Promise<ReleaseInfo>((resolve) =>
			httpGet(`https://api.github.com/repos/${user}/${repo}/releases/latest`).andThen((data) =>
				resolve(HttpService.JSONDecode(data)),
			),
		);
	}

	/** Stores the result of the {@link GitFetch} function. */
	export interface GitFetchResult {
		/** The location of the filex extracted from Github. */
		Location: string;

		/** The release version installed. */
		ReleaseTag: string;

		/** Whether the project received a lazy update. Can be used to prompt the user that an update is available and to restart. */
		ProcessingUpdate: boolean;
	}

	/**
	 * Fetches a Github release and returns the location.
	 * If there is an update available (the tag does not match the cached tag), this function updates
	 * the cache in the background. You cah check if an update is processing in the background using
	 * {@link GitFetchResult.ProcessingUpdate}.
	 * @param user The owner of this repository.
	 * @param repo The name of this repository.
	 * @param tag The version of the release to fetch. Defaults to the latest release, but will make an HTTP GET request to get the latest version.
	 * @param asset The name of the release asset. If provided, this function downloads the release asset in its entirety. If `nil`, it downloads and unpacks the source.
	 * @returns The results of the fetch.
	 * @example
	 * ```lua
	 * local gitFetchResult = Rostruct.GitFetch("Roblox", "roact", "v1.3.0"):expect()
	 * local project = Rostruct.Require(gitFetchResult.Location)
	 * local Roact = project.RequirePromise:expect()
	 * if gitFetchResult.ProcessingUpdate then
	 * 	print("An update is available for Roact; re-execute to use it!")
	 * end
	 * ```
	 */
	export function GitFetch(user: string, repo: string, tag?: string, asset?: string): Promise<GitFetchResult> {
		const tagPromise =
			tag === undefined
				? GetLatestReleaseInfo(user, repo).andThen((info) => info.tag_name)
				: Promise.resolve(tag);
		return tagPromise.andThen((tagName) => {
			const assetUrl =
				asset !== undefined
					? `https://github.com/${user}/${repo}/releases/download/${tagName}/${asset}.zip`
					: `https://github.com/${user}/${repo}/archive/refs/tags/${tagName}.zip`;
			return GithubDownloader.fetch(assetUrl, `${user.lower()}-${repo.lower()}`, tagName, asset === undefined);
		});
	}

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
		function Init() {
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
		export function GetPath(file: string): string {
			if (!initialized) Init();
			return root + file;
		}

		/**
		 * Installs and caches a library locally or from a site.
		 * @param fileName The name of the library.
		 * @returns The library loaded in Lua.
		 */
		function installAsync<T extends keyof ExternalDependencies>(fileName: T): ExternalDependencies[T] {
			if (loadedModules[fileName]) return loadedModules[fileName] as ExternalDependencies[T];

			const dependency = GetPath("dependencies/" + fileName);
			const data = isfile(dependency) ? readfile(dependency) : game.HttpGetAsync(moduleUrls[fileName]);

			if (!isfile(dependency)) writefile(dependency, data);

			const [f, err] = loadstring(data, "=" + dependency);
			assert(f, err);
			return (loadedModules[fileName] = f() as ExternalDependencies[T]);
		}

		/**
		 * Installs or gets an external dependency from the `rostruct/dependencies/` cache.
		 * Returns the value of `loadfile("rostruct/dependencies/" ... fileName)()`
		 * @param fileName The name of the file.
		 * @returns A promise which resolves with the library loaded in Lua.
		 * @example
		 * ```lua
		 * local Promise = Rostruct.Loader.Install("Promise.lua")
		 * Promise.new(...)
		 * ```
		 */
		export const Install = installAsync("Promise.lua").promisify(installAsync);
	}
}

const HttpService = game.GetService("HttpService");
const Promise = Rostruct.Loader.Install("Promise.lua").expect();

/** Sends an HTTP GET request. */
const httpGet = Promise.promisify((url: string) => game.HttpGetAsync(url));

/** Hosts functions with different aliases between exploits. */
namespace APISupport {
	declare const getsynasset: typeof getcustomasset;
	export const generateAssetId = getcustomasset || getsynasset;
}

/** Global environment reserved for Rostruct. */
namespace Reserved {
	interface Globals {
		/** A number used to identify Reconciler objects. */
		currentScope: number;

		/** List of environments for running VirtualScripts. */
		environments: Map<string, VirtualScript.Environment>;
	}

	/** Rostruct gglobals. */
	// export const globals: Globals = (getgenv()._ROSTRUCT as Globals) || {
	// 	currentScope: 0,
	// 	environments: new Map<string, VirtualScript.Environment>(),
	// };
	export const globals: Globals = {
		currentScope: 0,
		environments: new Map<string, VirtualScript.Environment>(),
	};

	getgenv()._ROSTRUCT = globals;
}

/** Store file information. Can be used to describe folders. */
class FileDescriptor {
	/** Whether `File.path` leads to a file. */
	public isFile: boolean;

	/** Whether `File.path` leads to a folder. */
	public isFolder: boolean;

	/** The path of this file. */
	public path: string;

	/** Optional root directory of this file. */
	public root?: string;

	/** The full name of this file (e.g. script.client.lua). */
	public fileName: string;

	/** The name of this file (e.g. **script**.client.lua). */
	public name: string;

	/** The full name excluding the extension (e.g. **script.client**.lua). */
	public fullName?: string;

	/** The extension of this file (e.g. script.client.**lua**). Not present for directories. */
	public extension?: string;

	/** The full extension of this file (e.g. script.**client.lua**). Not present for directories. */
	public type?: string;

	/** The contents of this file. Not present for directories. */
	public content?: string;

	/** Checks whether the given path points to a file or folder. */
	public static exists(path: string): boolean {
		return isfile(path) || isfolder(path);
	}

	/** Returns the path without a trailing slash. */
	public static format(path: string): string {
		return path.sub(path.size()) === "/" ? path.sub(1, path.size() - 1) : path;
	}

	/**
	 * Create a file information store.
	 * @param path A path to the file or folder.
	 * @param root Optional reference to the root directory.
	 */
	constructor(path: string, root?: string) {
		path = FileDescriptor.format(path.gsub("\\", "/")[0]);

		assert(FileDescriptor.exists(path), `File at '${path}' does not exist`);

		this.isFile = isfile(path);
		this.isFolder = isfolder(path);
		this.path = path;
		this.root = root;
		this.content = this.isFile ? readfile(path) : undefined;

		if (this.isFile) {
			this.fileName = path.match("([^/]+)$")[0] as string;
			this.name = this.fileName.match("^([^%.]+)")[0] as string;
			this.extension = this.fileName.match("%.([^%.]+)$")[0] as string;
			this.fullName = this.fileName.sub(1, -this.extension.size() - 2);
			this.type = this.fileName.match("%.(.*)")[0] as string;
		} else {
			this.fileName = path.match("([^/]+/?)$")[0] as string;
			this.name = this.fileName;
		}
	}

	/** Finds a file in the directory. */
	public find(path: string): FileDescriptor | undefined {
		const target = FileDescriptor.format(this.path) + "/" + path;
		const file = this.isFolder && FileDescriptor.exists(target) ? new FileDescriptor(target, this.root) : undefined;
		if (file) return file;
	}
}

/** Class used to connect a file to virtual code. */
class VirtualScript {
	/** Maps VirtualScripts to their instances. */
	private static readonly virtualScriptsByInstance = new Map<VirtualScript.Executable, VirtualScript>();

	/**
	 * Requires a `ModuleScript`. If the module has a `VirtualScript` counterparg, this function will call `virtualScript.execute` and return the results.
	 * @param obj The ModuleScript to require.
	 * @returns The required module.
	 */
	public static loadModule(obj: ModuleScript): VirtualScript | unknown {
		const virtualScript = VirtualScript.virtualScriptsByInstance.get(obj);
		if (virtualScript) return virtualScript.execute();
		else return require(obj);
	}

	/**
	 * Returns the `VirtualScript` instance that was created for the given `Instance`.
	 * @param obj The Instance to search by.
	 * @returns The corresponding VirtualScript.
	 */
	public static fromInstance(obj: VirtualScript.Executable): VirtualScript | undefined {
		return this.virtualScriptsByInstance.get(obj);
	}

	/** An identifier for this object. */
	public readonly id: string;

	/** The Instance this object was created for. */
	public readonly instance: VirtualScript.Executable;

	/** The FileDescriptor this object represents. */
	public readonly file: FileDescriptor;

	/** The scope of the Reconciler that created this object. Used to prevent overlapping globals when two Reconcilers are created. */
	private readonly scope: number;

	/** The function to be called at runtime when the script runs or gets required. */
	private executor?: VirtualScript.Executor;

	/** The executor's return value after being called the first time. ModuleScripts must have a non-nil result. */
	private result?: unknown;

	/** Whether the executor has already been called. */
	private isLoaded = false;

	/** The custom environment of the object. */
	private readonly env: VirtualScript.Environment;

	/** Construct a new VirtualScript. */
	constructor(obj: VirtualScript.Executable, file: FileDescriptor, scope: number) {
		assert(file.root, "VirtualScript file must have a root directory");

		this.id = `VirtualScript-${HttpService.GenerateGUID(false)}`;
		this.instance = obj;
		this.file = file;
		this.scope = scope;

		this.env = new Map<VirtualScript.EnvironmentKey, unknown>([
			["script", obj],
			["require", (obj: ModuleScript) => VirtualScript.loadModule(obj)],
			["_PATH", file.path],
			["_ROOT", file.root],
		]);

		Reserved.globals.environments.set(`${scope}-${this.id}`, this.env);
		VirtualScript.virtualScriptsByInstance.set(obj, this);
	}

	/**
	 * Generates a source script with globals defined as local variables.
	 * @returns The source of the VirtualScript.
	 */
	private getSource(): string {
		let header = `local _ENV = getgenv()._ROSTRUCT.environments['${this.scope}-${this.id}']; `;
		for (const [key] of this.env) {
			header += `local ${key} = _ENV['${key}']; `;
		}
		return header + this.file.content;
	}

	/**
	 * Sets the executor function.
	 * @param exec The function to call on execution.
	 */
	public setExecutor(exec: VirtualScript.Executor) {
		this.executor = exec;
		this.result = undefined;
	}

	/**
	 * Gets or creates a new executor function
	 * @returns The function to call on execution.
	 */
	public createExecutor(): VirtualScript.Executor {
		if (this.executor) return this.executor;
		const [f, err] = loadstring(this.getSource(), "=" + this.file.path);
		assert(f, err);
		return (this.executor = f);
	}

	/**
	 * Runs the executor function if not already run and returns results.
	 * @returns The value returned by the executor.
	 */
	public execute(): ReturnType<VirtualScript.Executor> {
		if (this.isLoaded) return this.result;
		const result = this.createExecutor()();
		assert(this.instance.IsA("ModuleScript") && result, `Module '${this.file.path}' did not return any value`);
		this.isLoaded = true;
		return (this.result = result);
	}

	/**
	 * Runs the executor function if not already run and returns results. Used internally.
	 * @returns A promise which resolves with the value returned by the executor.
	 */
	private executePromisified = Promise.promisify(() => this.execute());

	/**
	 * Runs the executor function if not already run and returns results.
	 * @returns A promise which resolves with the value returned by the executor.
	 */
	public executePromise(): Promise<ReturnType<VirtualScript.Executor>> {
		return this.executePromisified().timeout(
			30,
			`Script ${this.file.path} reached execution timeout! Try not to yield the main thread in LocalScripts.`,
		);
	}
}
declare namespace VirtualScript {
	/** A script that can be created by Rostruct. */
	export type Executable = ModuleScript | LocalScript | Script;
	export type Executor = () => unknown;
	export type EnvironmentKey = "script" | "require" | "_PATH" | "_ROOT";

	/** Base environment for VirtualScript instances. */
	export type Environment = Map<EnvironmentKey, unknown>;
}

/** Class used to build and deploy Rostruct projects. */
class Reconciler {
	/** A list of special file names that don't become files. */
	private static readonly reservedNames: { [key: string]: boolean } = {
		"init.lua": true,
		"init.server.lua": true,
		"init.client.lua": true,
		"init.meta.json": true,
	};

	/** An identifier for this object. */
	public readonly scope: number;

	/** The file the object will build. */
	public readonly target: FileDescriptor;

	/** Maps tracked VirtualScript objects to their file locations. */
	public readonly virtualScriptMap = new Map<string, VirtualScript>();

	/** Construct a new Reconciler. */
	constructor(directory: FileDescriptor) {
		this.target = directory;
		this.scope = Reserved.globals.currentScope;
		Reserved.globals.currentScope += 1;
	}

	/**
	 * Maps a VirtualScript object to its file location and returns it.
	 * @param obj The VirtualScript to track.
	 * @returns The original object.
	 */
	private trackScript<T extends VirtualScript>(obj: T): T {
		this.virtualScriptMap.set(obj.file.path, obj);
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
	private makeInstance(file: FileDescriptor, name: string = file.name, parent?: Instance): Instance | undefined {
		switch (file.extension) {
			case "lua":
				let executable: VirtualScript.Executable;

				if (file.type === "server.lua") executable = this.make("Script", name, parent);
				else if (file.type === "client.lua") executable = this.make("LocalScript", name, parent);
				else executable = this.make("ModuleScript", name === file.name ? file.fullName! : name, parent);

				this.trackScript(new VirtualScript(executable as VirtualScript.Executable, file, this.scope));

				return executable;

			case "json":
				const jsonObj = this.make("ModuleScript", name, parent);
				this.trackScript(new VirtualScript(jsonObj, file, this.scope)).setExecutor(() =>
					HttpService.JSONDecode(file.content!),
				);
				return jsonObj;

			case "txt":
				const stringValue = this.make("StringValue", name, parent);
				stringValue.Value = file.content!;
				return stringValue;

			case "rbxm":
				assert(
					APISupport.generateAssetId,
					`This exploit does not support rbxasset:// generation! (${file.path})`,
				);
				return game.GetObjects(APISupport.generateAssetId(file.path))[0];

			case "rbxmx":
				assert(
					APISupport.generateAssetId,
					`This exploit does not support rbxasset:// generation! (${file.path})`,
				);
				return game.GetObjects(APISupport.generateAssetId(file.path))[0];

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
	private makeContainer(dir: FileDescriptor, parent?: Instance): Instance {
		let instance: Instance | undefined;

		// Check if the directory contains a class override.
		// https://rojo.space/docs/6.x/sync-details/#scripts
		if (dir.find("init.lua")) instance = this.makeInstance(dir.find("init.lua")!, dir.name);
		else if (dir.find("init.server.lua")) instance = this.makeInstance(dir.find("init.server.lua")!, dir.name);
		else if (dir.find("init.client.lua")) instance = this.makeInstance(dir.find("init.client.lua")!, dir.name);

		// https://rojo.space/docs/6.x/sync-details/#meta-files
		if (dir.find("init.meta.json")) {
			const metadata: Reconciler.InstanceMetadata<"Folder"> = HttpService.JSONDecode(
				dir.find("init.meta.json")!.content!,
			);

			if (instance && metadata.className)
				error(`Attempt to reassign ClassName of ${dir.path} to ${metadata.className}`);

			if (!instance) instance = this.make(metadata.className || "Folder", dir.name);

			if (metadata.properties)
				for (const [key, value] of metadata.properties) {
					instance[key] = value;
				}
		}

		// If nothing's different, just make a folder.
		if (!instance) instance = this.make("Folder", dir.name);

		// Scan the directory for more files.
		for (const f of listfiles(dir.path)) {
			const child = new FileDescriptor(f, this.target.path);
			if (child && !Reconciler.reservedNames[child.fileName])
				if (child.isFile) this.makeInstance(child, undefined, instance);
				else this.makeContainer(child, instance);
		}

		instance.Parent = parent;

		return instance;
	}

	/**
	 * Generates an Instance tree using the file provided in the {@link constructor}.
	 * @param name Optional name of the tree.
	 * @returns The Instance created.
	 */
	public buildTree(name?: string, parent?: Instance): Instance {
		const tree = this.target.isFile ? this.makeInstance(this.target) : this.makeContainer(this.target);
		assert(tree, `Unable to build project ${this.target.path} (invalid instance)`);
		if (name !== undefined) tree.Name = name;
		if (parent) tree.Parent = parent;
		return tree;
	}

	/**
	 * Deploys the build by executing all tracked LocalScripts on new threads.
	 * @returns
	 * An array of promises that resolve with an array containing the LocalScript and the result of executing it.
	 * The promises resolve this way so `Promise.all` calls to contain both the LocalScript and the result.
	 */
	public deploy(): Array<Promise<[LocalScript, unknown]>> {
		const newPromises = new Array<Promise<[LocalScript, unknown]>>();
		for (const [_, virtualScript] of this.virtualScriptMap)
			if (virtualScript.instance.IsA("LocalScript"))
				newPromises.push(
					virtualScript.executePromise().then((result) => {
						return [virtualScript.instance as LocalScript, result];
					}),
				);
		return newPromises;
	}
}
declare namespace Reconciler {
	/** Interface for `init.meta.json` data. */
	export interface InstanceMetadata<T extends keyof Instances> {
		className?: T;
		properties?: Map<keyof WritableInstanceProperties<Instances[T]>, never>;
	}
}

/** Library for unzipping Github projects. */
namespace GithubDownloader {
	/** A list of files and directories sorted by deepness. */
	type ZipSort = Array<ZipSortEntry>;

	/** Data of a file or directory extracted from a zip file. */
	interface ZipSortEntry {
		path: string;
		content: string;
		isDirectory: boolean;
	}

	/**
	 * Sorts data returned by `zzlib.unzip`.
	 * @param zipData Data returned by `zzlib.unzip`.
	 * @returns A sorted list of files and directories.
	 */
	function sortZipData(zipData: ZipData): ZipSort {
		const zipSort = new Array<ZipSortEntry>();

		// Create sortable entries for each file.
		for (const [path, content] of zipData) {
			zipSort.push({
				path: path,
				content: content,
				isDirectory: path.sub(path.size()) === "/",
			});
		}

		// Sort entries by level.
		zipSort.sort((a, b) => a.path.gsub("/", "/")[1] < b.path.gsub("/", "/")[1]);

		return zipSort;
	}

	/**
	 * Extracts data returned by `zzlib.unzip` to the given location.
	 * @param zipData Data returned by `zzlib.unzip`.
	 * @param location The location to extract the files to.
	 * @param excludesRoot
	 * Whether extraction will ignore the topmost folder.
	 * If `true`, all files inside of the topmost folder in the zip file will be extracted to the location.
	 */
	function extractFromZipData(zipData: ZipData, location: string, excludesRoot?: boolean) {
		const zipSort = sortZipData(zipData);
		const root = zipSort[0].path.match(".*/")[0] as string;

		function formatPath(path: string): string {
			if (excludesRoot) return location + path.sub(root.size() + 1);
			else return location + path;
		}

		// Create directories first to avoid file creation racing.
		for (const entry of zipSort) if (entry.isDirectory) makefolder(formatPath(entry.path));

		// Then, we can create the files.
		for (const entry of zipSort) if (!entry.isDirectory) writefile(formatPath(entry.path), entry.content);
	}

	/**
	 * Checks whether the project needs an update.
	 * @param name The name of the project in the cache.
	 * @param tag The version of the given data used for caching and version checking.
	 * @returns Whether the cache needs an update.
	 */
	function shouldUpdate(name: string, tag: string): boolean {
		const location = Rostruct.Loader.GetPath(`cache/${name}/`);
		const tagLocation = location + "VERSION_ROSTRUCT.txt";

		// The tag is the same as the one cached, do not update.
		if (isfolder(location) && isfile(tagLocation) && readfile(tagLocation) === tag) return false;

		// The project needs to update the tag.
		return true;
	}

	/**
	 * Extracts raw zip data to the configured project folder.
	 * @param data The zip data.
	 * @param name The name of the project in the cache.
	 * @param tag The version of the given data used for caching and version checking.
	 * @param excludesRoot Whether extraction will ignore the topmost folder.
	 * If `true`, all files inside of the topmost folder in the zip file will be extracted to the location.
	 * @returns The location of the project and whether the cache was updated.
	 */
	function extract(
		data: string,
		target: string,
		tag: string,
		excludesRoot?: boolean,
	): Promise<Rostruct.GitFetchResult> {
		const tagLocation = target + "VERSION_ROSTRUCT.txt";

		// The project needs an update/has no tag, so clear existing files.
		if (FileDescriptor.exists(target)) delfolder(target);
		makefolder(target);

		// Extract the file.
		return Rostruct.Loader.Install("zzlib.lua").andThen((zzlib) => {
			extractFromZipData(zzlib.unzip(data), target, excludesRoot);
			if (tag !== undefined) writefile(tagLocation, tag);
			return {
				Location: target,
				ReleaseTag: tag,
				ProcessingUpdate: true,
			};
		});
	}

	/**
	 * Extracts raw zip data from the given URL to the configured `projects` folder.
	 * Lazily updates the cache in the background.
	 * @param url The URL to send an HTTP GET request to.
	 * @param name The name of the project when extracted to the `projects` folder.
	 * @param tag The version of the given data used for caching and version checking.
	 * @param excludesRoot Whether extraction will ignore the topmost folder.
	 * If `true`, all files inside of the topmost folder in the zip file will be extracted to the location.
	 * @returns A promise which resolves with the location of the project and whether the cache was updated.
	 */
	export function fetch(
		url: string,
		name: string,
		tag: string,
		excludesRoot?: boolean,
	): Promise<Rostruct.GitFetchResult> {
		const target = Rostruct.Loader.GetPath(`cache/${name}/`);
		const needsUpdate = shouldUpdate(name, tag);

		let downloadPromise: Promise<Rostruct.GitFetchResult>;

		// Update the cache in the background.
		if (needsUpdate) downloadPromise = httpGet(url).andThen((data) => extract(data, target, tag, excludesRoot));

		// If a previous version is available, return it immediately.
		if (FileDescriptor.exists(target))
			return Promise.resolve({
				Location: target,
				ReleaseTag: tag,
				ProcessingUpdate: needsUpdate,
			});
		// If there is no fallback, return the file download promise.
		else return downloadPromise!;
	}
}

export = Rostruct;
