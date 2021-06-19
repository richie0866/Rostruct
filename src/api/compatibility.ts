// Makes an HTTP request
declare const syn: {
	request: typeof request;
};
export const httpRequest = request || syn.request;

// Gets an asset by moving it to Roblox's content folder
declare const getsynasset: typeof getcustomasset;
export const getContentId = getcustomasset || getsynasset;
