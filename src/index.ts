/*
 * File: index.ts
 * File Created: Sunday, 30th May 2021 11:40:31 pm
 * Author: richard
 */

import { httpGet } from "api/compatibility";
import { Git, GitFetchResult } from "git";
import { Promise } from "loader";
import { Files } from "utils/files";
import Reconciler from "reconciler";
import VirtualScript from "virtualScript";

const HttpService = game.GetService("HttpService");

namespace Rostruct {
	/** Configuration settings for the current Rostruct build. */
	export const Config = {
		/** Whether the project builder will scan the project for a `src/` or `lib/` directory. */
		prioritizeSource: true,
	};

	/** Stores the result of {@link Rostruct.Build} and similar functions. */
	export interface Project {
		/** The Instance tree built. */
		Instance: Instance;

		/** The {@link Reconciler} object. */
		Reconciler: Reconciler;

		/** The file location of the project. May differ from the path provided to the function. */
		Path: string;

		/**
		 * An array of promises that resolve with LocalScripts and the result of executing them.
		 */
		RuntimePromises?: Array<Promise<[LocalScript, unknown]>>;

		/**
		 * A promise which resolves with the module required. Present when using {@link Rostruct.Require}.
		 * This function uses Promises for control over errors and yielding.
		 */
		RequirePromise?: Promise<unknown>;
	}

	/**
	 * Builds the given project as a Roblox Instance tree.
	 * @param target The target files to build.
	 * @param parent Optional parent of the Instance tree.
	 * @returns A project interface.
	 */
	export function Build(target: string, parent?: Instance): Project {
		const directory = Files.describeDirectory(target, target);
		const reconciler = new Reconciler(directory);
		return {
			Instance: reconciler.buildTree(parent),
			Reconciler: reconciler,
			Path: directory.location,
		};
	}

	/**
	 * Builds the given project and executes every tracked LocalScript.
	 * The result includes the {@link Project.RuntimePromises} fields.
	 * @param target The target files to build.
	 * @param parent Optional parent of the Instance tree.
	 * @returns A project interface.
	 */
	export function Deploy(target: string, parent?: Instance): Project {
		const project = Rostruct.Build(target, parent);
		project.RuntimePromises = project.Reconciler.deploy();
		return project;
	}

	/**
	 * Builds the given project and executes every tracked LocalScript.
	 * The result includes the {@link Project.RuntimePromises} and {@link Project.RequirePromise} fields.
	 * @param target The target files to build.
	 * @param parent Optional parent of the Instance tree.
	 * @returns A project interface.
	 */
	export function Require(target: string, parent?: Instance): Project {
		const project = Rostruct.Build(target, parent);
		assert(project.Instance.IsA("ModuleScript"), `Object at path ${project.Path} must be a module`);
		project.RuntimePromises = project.Reconciler.deploy();
		project.RequirePromise = VirtualScript.fromInstance(project.Instance)!.executePromise();
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
			httpGet(`https://api.github.com/repos/${user}/${repo}/releases/latest`).andThen((data) =>
				resolve(HttpService.JSONDecode(data)),
			),
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
	export function GitFetch(user: string, repo: string, tag?: string, asset?: string): Promise<GitFetchResult> {
		const tagPromise =
			tag === undefined
				? GetLatestReleaseInfo(user, repo).andThen((info) => info.tag_name)
				: Promise.resolve(tag);

		const cacheName = `${user.lower()}-${repo.lower()}-${asset !== undefined ? asset.lower() : "Source"}`;

		return tagPromise.andThen((tagName) => {
			const assetUrl =
				asset !== undefined
					? `https://github.com/${user}/${repo}/releases/download/${tagName}/${asset}`
					: `https://github.com/${user}/${repo}/archive/refs/tags/${tagName}.zip`;
			return Git.fetch(assetUrl, cacheName, tagName, asset === undefined);
		});
	}
}

export = Rostruct;
