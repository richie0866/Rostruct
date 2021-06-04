/*
 * File: index.ts
 * File Created: Sunday, 30th May 2021 11:40:31 pm
 * Author: richard
 */

import * as httpUtils from "utils/http-utils";
import Promise from "packages/Promise";
import * as fileUtils from "utils/file-utils";
import { Reconciler } from "core/Reconciler";
import { VirtualScript } from "core/VirtualScript";

const HttpService = game.GetService("HttpService");

// TODO: Define these interfaces in a designated 'interfaces.ts' file

/** Stores the result of {@link Build} and similar functions. */
export interface Project {
	/** The Instance tree built. */
	Instance: Instance;

	/** The {@link Reconciler} object (used internally). */
	Reconciler: Reconciler;

	/** The file location of the project. */
	Location: string;

	/** A promise that resolves once all scripts finish executing, returning an array of every script run. */
	RuntimeWorker?: Promise<LocalScript[]>;

	/** A promise which resolves with what the module returned. */
	RequirePromise?: Promise<unknown>;
}

/** Configuration settings for the current Rostruct build. */
export const Config = {};

/**
 * Builds the given project as a Roblox Instance tree.
 * @param target The target files to build.
 * @param parent Optional parent of the Instance tree.
 * @returns A project interface.
 */
export function Build(target: string, parent?: Instance): Project {
	const directory = fileUtils.describeDirectory(target, target);
	const reconciler = new Reconciler(directory);
	return {
		Instance: reconciler.reify(parent),
		Reconciler: reconciler,
		Location: directory.location,
	};
}

/**
 * Builds the given project and executes every tracked LocalScript.
 * The result includes the {@link Project.RuntimeWorker} fields.
 * @param target The target files to build.
 * @param parent Optional parent of the Instance tree.
 * @returns A project interface.
 */
export function Deploy(target: string, parent?: Instance): Project {
	const project = Build(target, parent);
	project.RuntimeWorker = project.Reconciler.deployWorker();
	return project;
}

/**
 * Builds the given project and executes every tracked LocalScript.
 * The result includes the {@link Project.RuntimeWorker} and {@link Project.RequirePromise} fields.
 * @param target The target files to build.
 * @param parent Optional parent of the Instance tree.
 * @returns A project interface.
 */
export function Require(target: string, parent?: Instance): Project {
	const project = Build(target, parent);
	assert(project.Instance.IsA("ModuleScript"), `Object at path ${project.Location} must be a module`);
	project.RuntimeWorker = project.Reconciler.deployWorker();
	project.RequirePromise = VirtualScript.getFromInstance(project.Instance)!.deferExecutor();
	return project;
}

/**
 * Returns information about the latest release of the repository.
 * Can be paired with the second return value of {@link GitFetch} to get information about an update's changes.
 * @param user The owner of this repository.
 * @param repo The name of this repository.
 * @returns Information about the latest release of the repository.
 */
export function GetLatestReleaseInfo(user: string, repo: string): Promise<ReleaseInfo> {
	return new Promise<ReleaseInfo>((resolve) =>
		httpUtils
			.get(`https://api.github.com/repos/${user}/${repo}/releases/latest`)
			.andThen((data) => resolve(HttpService.JSONDecode(data))),
	);
}

/**
 * Fetches a Github release and returns the location.
 * If there is an update available (the tag does not match the cached tag), this function updates
 * the cache in the background. You cah check if an update is processing in the background using
 * {@link GitFetchResult.ProcessingUpdate}.
 * @param user The owner of this repository.
 * @param repo The name of this repository.
 * @param tag The version of the release to fetch. Defaults to the latest release, but will make an HTTP GET request to get the latest version.
 * @param asset The name of the release asset. If provided, this function downloads the release asset in its entirety. If `nil`, it downloads and unpacks the source.
 * @returns The results of the fetch.
 */
//export function GitFetch(user: string, repo: string, tag?: string, asset?: string): Promise<GitFetchResult> {
//	const tagPromise =
//		tag === undefined ? GetLatestReleaseInfo(user, repo).andThen((info) => info.tag_name) : Promise.resolve(tag);
//
//	const cacheName = `${user.lower()}-${repo.lower()}-${asset !== undefined ? asset.lower() : "Source"}`;
//
//	return tagPromise.andThen((tagName) => {
//		const assetUrl =
//			asset !== undefined
//				? `https://github.com/${user}/${repo}/releases/download/${tagName}/${asset}`
//				: `https://github.com/${user}/${repo}/archive/refs/tags/${tagName}.zip`;
//		return Git.fetch(assetUrl, cacheName, tagName, asset === undefined);
//	});
//}
