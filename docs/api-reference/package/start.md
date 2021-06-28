# start <span class="base-tag promise-tag"></span>

``` ts
function start(): Promise<LocalScript[]>
```

Runs every LocalScript created with the `build` method after the next `Heartbeat` event.

The function returns a Promise that resolves once every script finishes executing. The Promise cancels if any of the scripts throw an error on the **root scope**[^1], but the rest of the scripts will continue.

!!! warning "Script timeout"

	After ten seconds of suspended execution from any script, the Promise will cancel.

	Code within the **root scope**[^1] of any LocalScript or ModuleScript should try to finish ASAP, and should avoid yielding if possible!

---

## Example usage

``` lua
local package = Rostruct.open("PathTo/MyModule/")

package:build("src/", { Name = "MyModule" })

package:start()
	:andThen(function(scripts)
		print("Scripts executed:")
		for _, script in ipairs(scripts) do
			print(script:GetFullName())
		end
	end)
	:catch(function(err)
		if Promise.Error.isKind(err, Promise.Error.Kind.TimedOut) then
			warn("Script execution timed out!")
		else
			warn("Something went wrong: " .. tostring(err))
		end
	end)
```

[^1]: Refers to the main thread the script is running in, and does not include functions spawned on different threads.
