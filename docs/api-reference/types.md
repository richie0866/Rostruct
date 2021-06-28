# Types

Some Rostruct functions may return tables to store data in one place. The structures of these tables are documented on this page.

---

## `FetchInfo` <span class="base-tag interface-tag"></span>

``` ts
interface FetchInfo {
	/** The folder the release was saved to. */
	readonly location: string;

	/** Whether the operation downloaded a new release. */
	readonly updated: boolean;

	/** The owner of the repository. */
	readonly owner: string;

	/** The name of the repository. */
	readonly repo: string;

	/** The version of the release. */
	readonly tag: string;

	/** The specific asset that was downloaded. */
	readonly asset: "Source code" | string;
}
```

Represents the status of a GitHub Release fetch operation. `FetchInfo` is used in a Package object's [`fetchInfo`](./package/properties.md#fetchinfo) property.

The `owner`, `repo`, `tag`, and `asset` fields typically reference the arguments passed to a `fetch` function.

If an asset isn't passed to the `fetch` function, `asset` defaults to `#!lua "Source code"`. The `tag` field also defaults to the latest stable version of the repository.
