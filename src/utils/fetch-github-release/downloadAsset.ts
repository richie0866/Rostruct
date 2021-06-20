import * as http from "utils/http";
import { makeFile } from "utils/file-utils";
import { extract } from "utils/extract";
import type { Release } from "./types";

/**
 * Downloads the asset file for a release.
 * @param release The release to get the asset from.
 * @param asset Optional name of the asset. If not provided, the function returns the zipball URL.
 * @returns The file data for an asset.
 */
export async function downloadAsset(release: Release, path: string, asset?: string): Promise<void> {
	let assetUrl: string;

	// If 'asset' is specified, get the URL of the asset.
	if (asset !== undefined) {
		const releaseAsset = release.assets.find((a) => a.name === asset);
		assert(releaseAsset, `Release '${release.name}' does not have asset '${asset}'`);
		assetUrl = releaseAsset.browser_download_url;
	}
	// Otherwise, download from the source zipball.
	else assetUrl = release.zipball_url;

	const response = await http.request({
		Url: assetUrl,
		Headers: {
			"User-Agent": "rostruct",
		},
	});

	assert(response.Success, response.StatusMessage);

	asset !== undefined && asset.match("([^%.]+)$")[0] !== "zip"
		? // If 'asset' does not end with '.zip', write the contents to a file.
		  makeFile(path + asset, response.Body)
		: // Magic boolean alert! If 'asset' is undefined, pass it to the 'ungroup'
		  // parameter. This is because the zipball contains a folder with the source code,
		  // and we have to ungroup this folder to extract the source files to 'path'.
		  extract(response.Body, path, asset === undefined);
}
