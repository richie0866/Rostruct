# Globals

Scripts executed by Rostruct have modified globals to stay consistent with how actual Roblox scripts run.

For example, the `#!lua require()` function is modified to load the ModuleScript objects Rostruct creates, and provides a detailed error traceback for recursive `#!lua require()` calls.

Global environments are modified internally with the `#!lua setfenv()` function. Rostruct also adds some extra globals for convenience:

---

## `_ROOT` <span class="base-tag read-only-tag"></span>

``` ts
const _ROOT: string
```

A reference to the root directory passed to `Rostruct.open`, or a release in the local cache when called with `Rostruct.fetch` or `Rostruct.fetchLatest`.

---

## `_PATH` <span class="base-tag read-only-tag"></span>

``` ts
const _PATH: string
```

A path to the Lua file that is being executed.
