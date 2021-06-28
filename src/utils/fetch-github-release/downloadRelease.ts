import { JsonStore } from "utils/JsonStore";
import { downloadAsset } from "./downloadAsset";
import { bootstrap, getRostructPath } from "bootstrap";
import { identify } from "./identify";
import { getLatestRelease, getRelease } from "./getReleases";
import type { FetchInfo } from "./types";

/** Object used to modify the JSON file with decoded JSON data. */
const savedTags = new JsonStore(getRostructPath("RELEASE_TAGS"));

/**
 * Downloads a release from the given repository. If `asset` is undefined, it downloads
 * the source zip files and extracts them. Automatically extracts .zip files.
 * This function does not download prereleases or drafts.
 * @param owner The owner of the repository.
 * @param repo The name of the repository.
 * @param tag The release tag to download.
 * @param asset Optional asset to download. Defaults to the source files.
 * @returns A download result interface.
 */
export async function downloadRelease(owner: string, repo: string, tag: string, asset?: string): Promise<FetchInfo> {
	// Type assertions:
	assert(type(owner) === "string", "Argument 'owner' must be a string");
	assert(type(repo) === "string", "Argument 'repo' must be a string");
	assert(type(tag) === "string", "Argument 'tag' must be a string");
	assert(asset === undefined || type(asset) === "string", "Argument 'asset' must be a string or nil");

	const id = identify(owner, repo, tag, asset);
	const path = getRostructPath("RELEASE_CACHE") + id + "/";

	// If the path is taken, don't download it again
	if (isfolder(path))
		return {
			location: path,
			owner: owner,
			repo: repo,
			tag: tag,
			asset: asset ?? "Source code",
			updated: false,
		};

	const release = await getRelease(owner, repo, tag);
	await downloadAsset(release, path, asset);

	return {
		location: path,
		owner: owner,
		repo: repo,
		tag: tag,
		asset: asset ?? "Source code",
		updated: true,
	};
}

/**
 * Downloads the latest release from the given repository. If `asset` is undefined,
 * it downloads the source zip files and extracts them. Automatically extracts .zip files.
 * This function does not download prereleases or drafts.
 * @param owner The owner of the repository.
 * @param repo The name of the repository.
 * @param asset Optional asset to download. Defaults to the source files.
 * @returns A download result interface.
 */
export async function downloadLatestRelease(owner: string, repo: string, asset?: string): Promise<FetchInfo> {
	// Type assertions:
	assert(type(owner) === "string", "Argument 'owner' must be a string");
	assert(type(repo) === "string", "Argument 'repo' must be a string");
	assert(asset === undefined || type(asset) === "string", "Argument 'asset' must be a string or nil");

	const id = identify(owner, repo, undefined, asset);
	const path = getRostructPath("RELEASE_CACHE") + id + "/";

	const release = await getLatestRelease(owner, repo);

	savedTags.open();

	// Check if the cache is up-to-date
	if (savedTags.get(id) === release.tag_name && isfolder(path)) {
		savedTags.close();
		return {
			location: path,
			owner: owner,
			repo: repo,
			tag: release.tag_name,
			asset: asset ?? "Source code",
			updated: false,
		};
	}

	// Update the cache with the new tag
	savedTags.set(id, release.tag_name);
	savedTags.close();

	// Make sure nothing is at the path before downloading!
	if (isfolder(path)) delfolder(path);

	// Download the asset to the cache
	await downloadAsset(release, path, asset);

	return {
		location: path,
		owner: owner,
		repo: repo,
		tag: release.tag_name,
		asset: asset ?? "Source code",
		updated: true,
	};
}

/** Clears the release cache. */
export function clearReleaseCache() {
	delfolder(getRostructPath("RELEASE_CACHE"));
	bootstrap();
}
