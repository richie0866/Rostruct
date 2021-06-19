import { httpRequest } from "api";

/** Sends an HTTP GET request. */
export const get = Promise.promisify((url: string) => game.HttpGetAsync(url));

/** Sends an HTTP POST request. */
export const post = Promise.promisify((url: string) => game.HttpPostAsync(url));

/** Makes an HTTP request. */
export const request = Promise.promisify((options: RequestAsyncRequest) => httpRequest(options));
