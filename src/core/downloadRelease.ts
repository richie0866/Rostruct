import { openJson } from "utils/common/openJson";
import { getLatestRelease, getRelease, identify } from "utils/github-release";
import { downloadAsset } from "./downloadAsset";
import * as fileManager from "./file-manager";
import { DownloadResult } from "./types";

const cacheObject = openJson(fileManager.lintPath("rostruct/cache/release_tags.json"));

/**
 * Downloads a release from the given repository. If `assetName` is undefined, it downloads
 * the source zip files and extracts them. Automatically extracts .zip files.
 * This function does not download prereleases or drafts.
 * @param owner The owner of the repository.
 * @param repo The name of the repository.
 * @param tag The release tag to download.
 * @param assetName Optional asset to download. Defaults to the source files.
 * @returns A download result interface.
 */
export async function downloadRelease(
	owner: string,
	repo: string,
	tag: string,
	assetName?: string,
): Promise<DownloadResult> {
	const id = identify(owner, repo, tag, assetName);
	const path = fileManager.lintPath("rostruct/cache/releases/", id) + "/";

	// If the path is taken, don't download it again
	if (isfolder(path)) return Promise.resolve({ Location: path, Tag: tag, Updated: false });

	const release = await getRelease(owner, repo, tag);
	await downloadAsset(release, path, assetName);

	return {
		Location: path,
		Tag: tag,
		Updated: true,
	};
}

/**
 * Downloads the latest release from the given repository. If `assetName` is undefined,
 * it downloads the source zip files and extracts them. Automatically extracts .zip files.
 * This function does not download prereleases or drafts.
 * @param owner The owner of the repository.
 * @param repo The name of the repository.
 * @param assetName Optional asset to download. Defaults to the source files.
 * @returns A download result interface.
 */
export async function downloadLatestRelease(owner: string, repo: string, assetName?: string): Promise<DownloadResult> {
	const id = identify(owner, repo, undefined, assetName);
	const path = fileManager.lintPath("rostruct/cache/releases/", id) + "/";

	const release = await getLatestRelease(owner, repo);
	const cacheData = cacheObject.load();

	// Check if the cache is up-to-date
	if (cacheData[id] === release.tag_name && isfolder(path))
		return { Location: path, Tag: release.tag_name, Updated: false };

	// Update the cache with the new tag
	cacheData[id] = release.tag_name;
	cacheObject.save();

	// Make sure nothing is at the path before downloading!
	if (isfolder(path)) delfolder(path);

	// Download the asset to the cache
	await downloadAsset(release, path, assetName);

	return {
		Location: path,
		Tag: release.tag_name,
		Updated: true,
	};
}

/** Clears the release cache. */
export function clearReleaseCache() {
	delfolder(fileManager.lintPath("rostruct/cache/releases/"));
	makefolder(fileManager.lintPath("rostruct/cache/releases/"));
	writefile(fileManager.lintPath("rostruct/cache/release_tags.json"), "{}");
}
