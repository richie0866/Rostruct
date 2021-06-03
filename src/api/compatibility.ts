/*
 * File: api.ts
 * File Created: Tuesday, 1st June 2021 9:01:33 pm
 * Author: richard
 * Description: Manages compatibility between exploits.
 */

declare const getsynasset: typeof getcustomasset;
export const generateAssetId = getcustomasset || getsynasset;

declare const syn_request: typeof request;
export const httpRequest = request || syn_request;

/** Append a file with no extension with `.file`. */
export function fixUnknownFile(file: string): string {
	const hasExtension = file.reverse().match("^([^%./]+%.)")[0] !== undefined;
	if (!hasExtension) return file + ".file";
	else return file;
}

/** Safely writes files by appending files with no extensions with `.file`. */
export const writeFile: typeof writefile = (file: string, content: string) => {
	writefile(fixUnknownFile(file), content);
};
