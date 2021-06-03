/*
 * File: http.ts
 * File Created: Wednesday, 2nd June 2021 6:43:27 pm
 * Author: richard
 */

import { httpRequest } from "api/compatibility";
import { Promise } from "storage";

/** Sends an HTTP GET request. */
export const get = Promise.promisify((url: string) => game.HttpGetAsync(url));

/** Sends an HTTP POST request. */
export const post = Promise.promisify((url: string) => {
	game.HttpPostAsync(url);
});

/** Makes an HTTP request. */
export const request = Promise.promisify((options: RequestAsyncRequest) => httpRequest(options));
