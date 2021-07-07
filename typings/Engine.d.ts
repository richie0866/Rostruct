/**
 * Returns the Roblox global environment.
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

/** Returns the name of the executor. */
declare function identifyexecutor(): string;

// Filesystem

/** Check whether the given path points to a file. */
declare function isfile(path: string): boolean;

/** Check whether the given path points to a directory. */
declare function isfolder(path: string): boolean;

/** Load the given file and return its contents. */
declare function readfile(file: string): string;

/** Change the given file's contents. Creates a new file if it doesn't exist. */
declare function writefile(file: string, content: string): void;

/** Returns a list of file paths in the given directory. */
declare function listfiles(directory: string): Array<string>;

/** Create a new directory at the given path. */
declare function makefolder(directory: string): void;

/** Removes the directory at the given path. */
declare function delfolder(directory: string): void;

/** Generates a rbxasset:// [`content`](https://developer.roblox.com/en-us/articles/Content) URL for the given asset from Krnl's `workspace` directory. */
declare function getcustomasset(file: string): string;

/** Sends an HTTP request using a dictionary to specify the request data, such as the target URL, method, headers and request body data. It returns a dictionary that describes the response data received. */
declare function request(requestOptions: RequestAsyncRequest): RequestAsyncResponse;

/** Encodes the text to Base64. */
declare function base64_encode(text: string): string;

/** Encodes the text from Base64. */
declare function base64_decode(base64: string): string;

/** Hashes the text using the [SHA384](https://en.wikipedia.org/wiki/SHA-2) cipher. */
declare function sha384_hash(text: string): string;

interface DataModel {
	/** Sends an HTTP GET request. */
	HttpGetAsync(this: DataModel, url: string): string;

	/** Sends an HTTP POST request. */
	HttpPostAsync(this: DataModel, url: string): string; // TODO: Check what it actually returns

	/** Returns an array of Instances associated with the given [`content`](https://developer.roblox.com/en-us/articles/Content) URL. */
	GetObjects(this: DataModel, url: string): Instance[];
}

// Synapse

declare const syn: {
	request: typeof request;
};

declare const getsynasset: typeof getcustomasset;

// Scriptware

declare const http: {
	request: typeof request;
};
