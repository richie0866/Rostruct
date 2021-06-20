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
		public readonly dir: string,
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
	 * Turns the root directory and all descendants into Roblox objects.
	 * @returns A Roblox object for the root directory.
	 */
	public build(): Instance {
		// 'buildRoblox' should always return an Instance because 'dir' is a directory
		return buildRoblox(this, this.dir)!;
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

		// Define as constant because the typing for 'Promise.all' is funky
		const promise = Promise.all(executingPromises);

		return promise as Promise<LocalScript[]>;
	}
}
