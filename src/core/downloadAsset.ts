export async function downloadAsset(release: Release, path: string, assetName?: string): Promise<void> {
	const response = await http.request({
		Url: assetUrl,
		Headers: {
			"User-Agent": "rostruct",
		},
	});

	assert(response.Success, response.StatusMessage);

	assetName !== undefined && assetName.match("([^%.]+)$")[0] !== "zip"
		? // If 'assetName' does not end with '.zip', write the contents to a file.
		  makeFile(path + assetName, response.Body)
		: // Magic boolean alert! If 'assetName' is undefined, pass it to the 'ungroup'
		  // parameter. This is because the zipball contains a folder with the source code,
		  // and we have to ungroup this folder to extract the source files to 'path'.
		  extract(response.Body, path, assetName === undefined);
