import { HttpService } from "modules/services";
import * as http from "utils/http";
import type { Release } from "./types";

/**
 * Gets a list of releases for the Github repository.
 * Automatically excludes drafts, but excluding prereleases is optional.
 * @param owner The owner of the repository.
 * @param repo The repository name.
 * @param filterRelease Function to filter the release list.
 * @returns A list of Releases for the Github repository.
 */
export async function getReleases(
	owner: string,
	repo: string,
	filterRelease = (release: Release) => !release.draft,
): Promise<Release[]> {
	const response = await http.request({
		Url: `https://api.github.com/repos/${owner}/${repo}/releases`,
		Headers: {
			"User-Agent": "rostruct",
		},
	});
	assert(response.Success, response.StatusMessage);
	const releases = HttpService.JSONDecode<Release[]>(response.Body);
	return releases.filter(filterRelease);
}

/**
 * Gets a specific release for the given repository.
 * This function does not get prereleases!
 * @param owner The owner of the repository.
 * @param repo The repository name.
 * @param tag The release tag to retrieve.
 * @returns A list of Releases for the Github repository.
 */
export async function getRelease(owner: string, repo: string, tag: string): Promise<Release> {
	const response = await http.request({
		Url: `https://api.github.com/repos/${owner}/${repo}/releases/tags/${tag}`,
		Headers: {
			"User-Agent": "rostruct",
		},
	});
	assert(response.Success, response.StatusMessage);
	return HttpService.JSONDecode(response.Body);
}

/**
 * Gets the latest release for the given repository.
 * This function does not get prereleases!
 * @param owner The owner of the repository.
 * @param repo The repository name.
 * @returns A list of Releases for the Github repository.
 */
export async function getLatestRelease(owner: string, repo: string): Promise<Release> {
	const response = await http.request({
		Url: `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
		Headers: {
			"User-Agent": "rostruct",
		},
	});
	assert(response.Success, response.StatusMessage);
	return HttpService.JSONDecode(response.Body);
}
