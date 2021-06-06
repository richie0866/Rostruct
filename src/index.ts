// Setup

import { init } from "core";
init();

// Core

export {
	buildProject as Build,
	deployProject as Deploy,
	requireProject as Require,
	downloadRelease as DownloadRelease,
	downloadLatestRelease as DownloadLatestRelease,
	clearReleaseCache as ClearReleaseCache,
	Reconciler,
	VirtualScript,
} from "core";

// Packages

import Promise from "packages/Promise";
export { Promise };
