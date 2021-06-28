/**
 * Build your Lua projects from the filesystem.
 * @author 0866
 */

import { bootstrap } from "bootstrap";
import { Package } from "Package";
import { clearReleaseCache, downloadLatestRelease, downloadRelease } from "utils/fetch-github-release";

bootstrap();

/** Clears the GitHub Release cache. */
export const clearCache = () => clearReleaseCache();

/**
 * Creates a new Rostruct Package.
 * @param root A path to the project directory.
 * @returns A new Package object.
 */
export const open = (root: string): Package => new Package(root);

/**
 * Downloads and builds a release from the given repository.
 * If `asset` is undefined, it downloads source files through the zipball URL.
 * Automatically extracts .zip files.
 *
 * @param owner The owner of the repository.
 * @param repo The name of the repository.
 * @param tag The tag version to download.
 * @param asset Optional asset to download; If not specified, it downloads the source files.
 *
 * @returns A promise that resolves with a Package object, with the `fetchInfo` field.
 */
export const fetch = async (...args: Parameters<typeof downloadRelease>): Promise<Package> =>
	Package.fromFetch(await downloadRelease(...args));

/**
 * Downloads and builds a release from the given repository.
 * If `asset` is undefined, it downloads source files through the zipball URL.
 * Automatically extracts .zip files.
 *
 * @param owner The owner of the repository.
 * @param repo The name of the repository.
 * @param tag The tag version to download.
 * @param asset Optional asset to download; If not specified, it downloads the source files.
 *
 * @returns A new Package object, with the `fetchInfo` field.
 */
export const fetchAsync = (...args: Parameters<typeof downloadRelease>): Package =>
	Package.fromFetch(downloadRelease(...args).expect());

/**
 * **This function does not download prereleases or drafts.**
 *
 * Downloads and builds the latest release release from the given repository.
 * If `asset` is undefined, it downloads source files through the zipball URL.
 * Automatically extracts .zip files.
 *
 * @param owner The owner of the repository.
 * @param repo The name of the repository.
 * @param asset Optional asset to download; If not specified, it downloads the source files.
 *
 * @returns A promise that resolves with a Package object, with the `fetchInfo` field.
 */
export const fetchLatest = async (...args: Parameters<typeof downloadLatestRelease>): Promise<Package> =>
	Package.fromFetch(await downloadLatestRelease(...args));

/**
 * **This function does not download prereleases or drafts.**
 *
 * Downloads and builds the latest release release from the given repository.
 * If `asset` is undefined, it downloads source files through the zipball URL.
 * Automatically extracts .zip files.
 *
 * @param owner The owner of the repository.
 * @param repo The name of the repository.
 * @param asset Optional asset to download; If not specified, it downloads the source files.
 *
 * @returns A new Package object, with the `fetchInfo` field.
 */
export const fetchLatestAsync = (...args: Parameters<typeof downloadLatestRelease>): Package =>
	Package.fromFetch(downloadLatestRelease(...args).expect());
