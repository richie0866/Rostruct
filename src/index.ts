/**
 * @description Rostruct builds your Lua projects from the filesystem.
 * @author 0866
 */

import { bootstrap } from "bootstrap";
import Promise from "modules/Promise";

bootstrap();

export { Promise };

export { build, fetch, fetchLatest, fetchAndBuild, fetchLatestAndBuild } from "Rostruct";
