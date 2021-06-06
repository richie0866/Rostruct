import * as http from "utils/common/http";
import { makeFile } from "utils/filesystem";
import { extract } from "utils/common/extract";
import { Release } from "./types";

/**
 * Downloads and returns the asset file for a release.
 * @param release The release to get the asset from.
 * @param assetName Optional name of the asset. If not provided, the function returns the zipball URL.
 * @returns The file data for an asset.
 */
export function downloadAsset(release: Release, path: string, assetName?: string): Promise<void> {
	let assetUrl: string;

	if (assetName !== undefined) {
		const asset = release.assets.find((asset) => asset.name === assetName);
		assert(asset, `Release '${release.name}' does not have asset '${assetName}'`);
		assetUrl = asset.browser_download_url;
	} else assetUrl = release.zipball_url;

	return http
		.request({
			Url: assetUrl,
			Headers: {
				"User-Agent": "rostruct",
			},
		})
		.andThen((response) => {
			assert(response.Success, response.StatusMessage);

			assetName !== undefined && assetName.match("([^%.]+)$")[0] !== "zip"
				? // If 'assetName' does not end with '.zip', write the contents to a file.
				  makeFile(path + assetName, response.Body)
				: // Magic boolean alert! If 'assetName' is undefined, pass it to the 'ungroup'
				  // parameter. This is because the zipball contains a folder with the source code,
				  // and we have to ungroup this folder to extract the source files to 'path'.
				  extract(response.Body, path, assetName === undefined);
		});
}
