/** Modified version of a Lua zip library. */
interface zzlib {
	/**
	 * Unzips the given zip data and returns a map of files and their contents.
	 */
	readonly unzip: (buf: string) => ZipData;
}

/** A container for all files and file contents in a zip file. */
type ZipData = Map<string, string | undefined>;

declare const zzlib: zzlib;

export = zzlib;
