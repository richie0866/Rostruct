/*
 * File: Krnl.d.ts
 * File Created: Friday, 28th May 2021 1:13:35 am
 * Author: richard
 */

type MapKeyToModule = {
	readonly Promise: typeof Promise;
	readonly Maid: import("./modules/Maid");
	readonly Signal: import("./modules/Signal");
	readonly Thread: import("./modules/Thread");
};

interface Krnl {
	Base64: {
		readonly Encode: typeof base64_encode;
		readonly Decode: typeof base64_decode;
	};

	Crypt: {
		readonly Hash: typeof sha384_hash;
	};

	Vendor: {
		readonly Maid: "https://raw.githubusercontent.com/Quenty/NevermoreEngine/version2/Modules/Shared/Events/Maid.lua";
		readonly Promise: "https://gist.github.com/richie0866/f7c56370664cd8b6d13b02e70529fc86/raw/6e945905b6a1106276cf8b128893c2b50997a00f/Promise.lua";
		readonly Signal: "https://gist.githubusercontent.com/richie0866/98879ede8725238d6eb8523774ec31b9/raw/7a4a57334056de0fe84f602315ba5c45524b57d9/Signal.lua";
		readonly Thread: "https://gist.githubusercontent.com/richie0866/89a30f80b1562678a2d554c18c0a022f/raw/b53d733b2a52788648008d3bd7e553ea286f1d1e/Thread.lua";
		readonly Hook: "https://gist.githubusercontent.com/richie0866/dfff74c366c141a681b580f613f7962f/raw/d89456887e62a8d5a36da0317f25454c433fa0bb/Hook.lua";
	};

	Require<T extends keyof MapKeyToModule>(module: T): MapKeyToModule[T];
}

declare const Krnl: Krnl;

/** Returns the Roblox global environment.
 * @returns Roblox's global environment.
 */
declare function getrenv(): { [key: string]: unknown };

/**
 * Returns the current environment in use by the exploit.
 * @returns The exploit's global environment.
 * */
declare function getgenv(): { [key: string]: unknown };

/**
 * Loads a chunk.
 * If there are no syntactic errors, returns the compiled chunk as a function; otherwise, returns nil plus the error message.
 *
 * `chunkname` is used as the name of the chunk for error messages and debug information.
 * When absent, it defaults to chunk, if chunk is a string, or to "=(load)" otherwise.
 * @param chunk The string to load.
 * @param chunkname The name of the chunk.
 */
declare function loadstring(
	chunk: string,
	chunkname?: string,
): LuaTuple<[(...params: Array<unknown>) => unknown, string | undefined]>;

// Filesystem

/** Check whether the given path points to a file. */
declare function isfile(path: string): boolean;

/** Check whether the given path points to a directory. */
declare function isfolder(path: string): boolean;

/** Load the given file and return its contents. */
declare function readfile(file: string): string;

/** Change the given file's contents. Creates a new file if it doesn't exist. */
declare function writefile(file: string, content: string): undefined;

/** Returns a list of file paths in the given directory. */
declare function listfiles(directory: string): Array<string>;

/** Create a new directory at the given path. */
declare function makefolder(directory: string): undefined;

/** Removes the directory at the given path. */
declare function delfolder(directory: string): undefined;

/** Generates a rbxasset:// [`content`](https://developer.roblox.com/en-us/articles/Content) URL for the given asset from Krnl's `workspace` directory. */
declare function getcustomasset(file: string): string;

// Instances

interface DataModel {
	/** Sends an HTTP GET request. */
	HttpGetAsync(this: DataModel, url: string): string;

	/** Returns an array of Instances associated with the given [`content`](https://developer.roblox.com/en-us/articles/Content) URL. */
	GetObjects(this: DataModel, url: string): Array<Instance>;
}

// Crypt

/** Encodes the text to Base64. */
declare function base64_encode(text: string): string;

/** Encodes the text from Base64. */
declare function base64_decode(base64: string): string;

/** Hashes the text using the [SHA384](https://en.wikipedia.org/wiki/SHA-2) cipher. */
declare function sha384_hash(text: string): string;
