import { Store } from "./Store";
import { HttpService } from "modules/services";
import { VirtualScript } from "./VirtualScript";
import { build as buildRoblox } from "./build";

/** Class used to transform files into a Roblox instance tree. */
export class Session {
	/** List of Session objects for a given session id. */
	private static readonly sessions = Store.getStore<string, Session>("Sessions");

	/** An identifier used to reference a Session without passing it. */
	public readonly sessionId = HttpService.GenerateGUID(false);

	/** Store VirtualScript objects created for this Session. */
	private readonly virtualScripts = new Array<VirtualScript>();

	constructor(
		/** The directory to turn into an instance tree. */
		public readonly root: string,
	) {
		Session.sessions.set(this.sessionId, this);
	}

	/**
	 * Gets a Session object for the given session id.
	 * @param sessionId
	 * @returns A Session object if it exists.
	 */
	public static fromSessionId(sessionId: string): Session | undefined {
		return this.sessions.get(sessionId);
	}

	/**
	 * Stores a VirtualScript object.
	 * @param virtualScript A new VirtualScript object.
	 */
	public virtualScriptAdded(virtualScript: VirtualScript) {
		this.virtualScripts.push(virtualScript);
	}

	/**
	 * Turns descendants of the root directory into Roblox objects.
	 * If `path` is not provided, this function transforms the root directory.
	 * @param path Optional descendant to build in the root directory.
	 * @returns A Roblox object for the root directory.
	 */
	public build(path = ""): Instance | undefined {
		assert(
			isfile(this.root + path) || isfolder(this.root + path),
			`The path '${this.root + path}' must be a file or folder`,
		);

		return buildRoblox(this, this.root + path);
	}

	/**
	 * Runs every virtual LocalScript for this session on deferred threads.
	 * @returns
	 * A promise that resolves with an array of scripts that finished executing.
	 * If one script throws an error, the entire promise will cancel.
	 */
	public simulate(): Promise<LocalScript[]> {
		const executingPromises: Promise<LocalScript>[] = [];

		assert(this.virtualScripts.size() > 0, "This session cannot start because no LocalScripts were found.");

		for (const v of this.virtualScripts)
			if (v.instance.IsA("LocalScript"))
				executingPromises.push(v.deferExecutor().andThenReturn(v.instance as LocalScript));

		return Promise.all<Promise<LocalScript>[]>(executingPromises).timeout(10);
	}
}
