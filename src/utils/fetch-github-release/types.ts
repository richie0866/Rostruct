/** Information about the release being downloaded. */
export interface FetchInfo {
	/** A reference to where the data was extracted to. */
	location: string;

	/** The tag of the release that was downloaded. */
	tag: string;

	/** Whether the cache was updated to include this download. */
	updated: boolean;
}

export interface Author {
	readonly login: string;
	readonly id: number;
	readonly node_id: string;
	/** @example `https://avatars.githubusercontent.com/u/${id}?v=4` */
	readonly avatar_url: string;
	readonly gravatar_id: string;
	/** @example `https://api.github.com/users/${user}` */
	readonly url: string;
	/** @example `https://github.com/${user}` */
	readonly html_url: string;
	/** @example `https://api.github.com/users/${user}/followers` */
	readonly followers_url: string;
	/** @example `https://api.github.com/users/${user}/following{/other_user}` */
	readonly following_url: string;
	/** @example `https://api.github.com/users/${user}/gists{/gist_id}` */
	readonly gists_url: string;
	/** @example `https://api.github.com/users/${user}/starred{/owner}{/repo}` */
	readonly starred_url: string;
	/** @example `https://api.github.com/users/${user}/subscriptions` */
	readonly subscriptions_url: string;
	/** @example `https://api.github.com/users/${user}/orgs` */
	readonly organizations_url: string;
	/** @example `https://api.github.com/users/${user}/repos` */
	readonly repos_url: string;
	/** @example `https://api.github.com/users/${user}/events{/privacy}` */
	readonly events_url: string;
	/** @example `https://api.github.com/users/${user}/received_events` */
	readonly received_events_url: string;
	readonly type: string;
	readonly site_admin: boolean;
}

export interface Asset {
	/** @example `https://api.github.com/repos/${user}/${repo}/releases/assets/${id}` */
	readonly url: string;
	readonly id: number;
	readonly node_id: string;
	readonly name: string;
	readonly label?: string;
	readonly uploader: Author;
	readonly content_type: string;
	readonly state: string;
	readonly size: number;
	readonly download_count: number;
	readonly created_at: string;
	readonly updated_at: string;
	/** @example `https://github.com/${user}/${repo}/releases/download/${tag}/%{asset}` */
	readonly browser_download_url: string;
}

/**
 * Information about the latest release of a given Github repository.
 * See this [example](https://api.github.com/repos/Roblox/roact/releases/latest).
 */
export interface Release {
	/** @example `https://api.github.com/repos/${user}/${repo}/releases/${id}` */
	readonly url: string;
	/** @example `https://api.github.com/repos/${user}/${repo}/releases/${id}/assets` */
	readonly assets_url: string;
	/** @example `https://uploads.github.com/repos/${user}/${repo}/releases/${id}/assets{?name,label}` */
	readonly upload_url: string;
	/** @example `https://github.com/${user}/${repo}/releases/tag/${latestVersion}` */
	readonly html_url: string;
	readonly id: number;
	readonly author: Author;
	readonly node_id: string;
	readonly tag_name: string;
	readonly target_commitish: string;
	readonly name: string;
	readonly draft: boolean;
	readonly prerelease: boolean;
	readonly created_at: string;
	readonly published_at: string;
	readonly assets: Asset[];
	/** @example `https://api.github.com/repos/${user}/${repo}/tarball/${tag}` */
	readonly tarball_url: string;
	/** @example `https://api.github.com/repos/${user}/${repo}/zipball/${tag}` */
	readonly zipball_url: string;
	readonly body: string;
}
