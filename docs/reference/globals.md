# Globals

Scripts executed with Rostruct have a modified global environment in order to run as Roblox script objects. They also contain extra globals for convenience:

## <span class="code">_ROOT</span><small> : string</small>&nbsp; <span class="base-tag read-only-tag"></span> { data-toc-label="_ROOT" }

A reference to the original path to the project.

!!! example "Example value"
	`#!lua _ROOT == "projects/Roact/src/"`

## <span class="code">_PATH</span><small> : string</small>&nbsp; <span class="base-tag read-only-tag"></span> { data-toc-label="_PATH" }

A reference to the path of the file that is being executed.

!!! example "Example value"
	`#!lua _PATH == "projects/Roact/src/Portal.lua"`
