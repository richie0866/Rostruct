/*
 * File: zzlib.d.ts
 * File Created: Friday, 28th May 2021 11:49:10 am
 * Author: richard
 */

/** Modified version of a Lua zip library. */
export interface zzlib {
	/**
	 * Unzips the given zip data and returns a map of files and their contents.
	 */
	readonly unzip: (buf: string) => ZipData;
}

/** A container for all files and file contents in a zip file. */
export type ZipData = Map<string, string>;
