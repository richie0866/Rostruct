/*
 * File: fetch.ts
 * File Created: Tuesday, 1st June 2021 9:04:08 pm
 * Author: richard
 */

import { httpGet, writeFile } from "api/compatibility";
import { Files } from "utils/files";
import { Loader, Promise } from "loader";

/** Stores the result of the {@link GitFetch} function. */
export interface GitFetchResult {
	/** The location of the filex extracted from Github. */
	Location: string;

	/** The release version installed. */
	ReleaseTag: string;

	/** Whether the project received a lazy update. Can be used to prompt the user that an update is available and to restart. */
	ProcessingUpdate: boolean;
}

/** Library for unzipping Github projects. */
export namespace Git {
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
			if (excludesRoot) return location + "/" + path.sub(root.size() + 1);
			else return location + "/" + path;
		}

		// Create directories first! Files made in nonexistent folders fail with no error.
		for (const entry of zipSort) if (entry.isDirectory) makefolder(formatPath(entry.path));

		// Then, create the files.
		for (const entry of zipSort) if (!entry.isDirectory) writeFile(formatPath(entry.path), entry.content);
	}

	/**
	 * Checks whether the project needs an update.
	 * @param name The name of the project in the cache.
	 * @param tag The version of the given data used for caching and version checking.
	 * @returns Whether the cache needs an update.
	 */
	function shouldUpdate(name: string, tag: string): boolean {
		const location = Loader.getPath(`cache/${name}`);
		const tagLocation = location + "/VERSION_ROSTRUCT.txt";

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
	function extract(data: string, target: string, tag: string, excludesRoot?: boolean): Promise<GitFetchResult> {
		const tagLocation = Files.format(target) + "VERSION_ROSTRUCT.txt";

		// The project needs an update/has no tag, so clear existing files.
		if (Files.exists(target)) delfolder(target);
		makefolder(target);

		// Extract the file.
		return Loader.install("zzlib.lua").andThen((zzlib) => {
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
	export function fetch(url: string, name: string, tag: string, excludesRoot?: boolean): Promise<GitFetchResult> {
		const target = Loader.getPath(`cache/${name}`);
		const needsUpdate = shouldUpdate(name, tag);

		let downloadPromise: Promise<GitFetchResult>;

		// Update the cache in the background.
		if (needsUpdate) downloadPromise = httpGet(url).andThen((data) => extract(data, target, tag, excludesRoot));

		// If a previous version is available, return it immediately.
		if (Files.exists(target))
			return Promise.resolve({
				Location: target,
				ReleaseTag: tag,
				ProcessingUpdate: needsUpdate,
			});
		// If there is no fallback, return the file download promise.
		else return downloadPromise!;
	}
}
