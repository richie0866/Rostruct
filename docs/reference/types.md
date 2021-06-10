# Types

## <span class="code">BuildResult</span> <span class="tag-space"></span> <span class="base-tag interface-tag"></span>

<span class="code">
	<span class="keyword">interface</span> BuildResult <span class="symbol">{</span>  
	&nbsp;&nbsp;&nbsp;&nbsp;<span class="key">Instance</span><span class="symbol">: </span><span class="type">Instance</span><span class="symbol">;</span>  
	&nbsp;&nbsp;&nbsp;&nbsp;<span class="symbol">=> The Instance tree derived from your project files.</span>
</span>

<span class="code">
	&nbsp;&nbsp;&nbsp;&nbsp;<span class="key">Location</span><span class="symbol">: </span><span class="type">string</span><span class="symbol">;</span>  
	&nbsp;&nbsp;&nbsp;&nbsp;<span class="symbol">=> The file location of the project.</span>
</span>

<span class="code">
	&nbsp;&nbsp;&nbsp;&nbsp;<span class="key">RuntimeWorker</span><span class="symbol">?: </span><span class="interface">Promise</span><span class="symbol">&lt;</span><span class="type">LocalScript</span><span class="symbol">[]&gt;;</span>  
	&nbsp;&nbsp;&nbsp;&nbsp;<span class="symbol">=> Resolves once all scripts finish executing from [<span class="keyword"><u>Deploy</u></span>](./functions.md#deploy).</span>
</span>

<span class="code">
	&nbsp;&nbsp;&nbsp;&nbsp;<span class="key">Module</span><span class="symbol">?: </span><span class="interface">Promise</span><span class="symbol">&lt;</span><span class="type">any</span><span class="symbol">&gt;;</span>  
	&nbsp;&nbsp;&nbsp;&nbsp;<span class="symbol">=> Resolves with the value of the [<span class="keyword"><u>Require</u></span>](./functions.md#require) operation.</span>  
	<span class="symbol">}</span>
</span>

Stores the value of a successful build operation performed by [`Build`](./functions.md#build), [`Deploy`](./functions.md#deploy), or [`Require`](./functions.md#require).

!!! tip
	You can modify the `Instance` field before script runtime, as deployment executes them on deferred threads.


## <span class="code">DownloadResult</span> <span class="tag-space"></span> <span class="base-tag interface-tag"></span>

<span class="code">
	<span class="keyword">interface</span> DownloadResult <span class="symbol">{</span>  
	&nbsp;&nbsp;&nbsp;&nbsp;<span class="key">Location</span><span class="symbol">: </span><span class="type">string</span><span class="symbol">;</span>  
	&nbsp;&nbsp;&nbsp;&nbsp;<span class="symbol">=> A reference to the folder the file was saved to. Always a directory ending with <span class="highlight">/</span>.
</span>

<span class="code">
	&nbsp;&nbsp;&nbsp;&nbsp;<span class="key">Tag</span><span class="symbol">: </span><span class="type">string</span><span class="symbol">;</span>  
	<span class="symbol">&nbsp;&nbsp;&nbsp;&nbsp;=> The tag of the release that was downloaded.</span>
</span>

<span class="code">
	&nbsp;&nbsp;&nbsp;&nbsp;<span class="key">Updated</span><span class="symbol">: </span><span class="type">boolean</span><span class="symbol">;</span>  
	&nbsp;&nbsp;&nbsp;&nbsp;<span class="symbol">=> Whether the operation downloaded a new release.</span>  
	<span class="symbol">}</span>
</span>

Stores information about the release being downloaded by [`DownloadRelease`](./functions.md#downloadrelease) or [`DownloadLatestRelease`](./functions.md#downloadlatestrelease).

!!! tip
	Using the `Updated` and `Tag` fields, you can display update alerts and changelog pages to users.
