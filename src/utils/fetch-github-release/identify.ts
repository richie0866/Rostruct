/**
 * Creates a string identifier for the given download configuration.
 * @param owner The owner of the repository.
 * @param repo The repository name.
 * @param tag Optional release tag. Defaults to `"LATEST"`.
 * @param asset Optional release asset file. Defaults to `"ZIPBALL"`.
 * @returns An identifier for the given parameters.
 */
export function identify(owner: string, repo: string, tag?: string, asset?: string): string {
	const template = "%s-%s-%s-%s";
	return template.format(
		owner.lower(),
		repo.lower(),
		tag !== undefined ? tag.lower() : "LATEST",
		asset !== undefined ? asset.lower() : "ZIPBALL",
	);
}
