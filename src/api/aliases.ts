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
