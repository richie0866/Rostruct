/*
 * File: api.ts
 * File Created: Tuesday, 1st June 2021 9:01:33 pm
 * Author: richard
 * Description: Manages compatibility between exploits.
 */

declare const syn: {
	request: typeof request;
};
declare const getsynasset: typeof getcustomasset;

export const generateAssetId = getcustomasset || getsynasset;
export const httpRequest = request || syn.request;
