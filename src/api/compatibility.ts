/*
 * File: api.ts
 * File Created: Tuesday, 1st June 2021 9:01:33 pm
 * Author: richard
 * Description: Manages compatibility between exploits.
 */

import { Promise } from "loader";

declare const getsynasset: typeof getcustomasset;
export const generateAssetId = getcustomasset || getsynasset;

/** Safely writes files by appending files with no extensions with `.file`. */
export const writeFile: typeof writefile = (file: string, content: string) => {
	const extension = file.match("%.([^%./]+)$")[0];
	if (extension === undefined) file += ".file";
	writefile(file, content);
};

/** Sends an HTTP GET request. */
export const httpGet = Promise.promisify((url: string) => game.HttpGetAsync(url));
