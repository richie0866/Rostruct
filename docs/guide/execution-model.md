# Execution model

## Catching Rostruct errors

Functions like `Rostruct.Require` and `Rostruct.Deploy` use the Promise object to manage yielding and error handling. Errors thrown during runtime can be caught using the `Promise:catch` method:

```lua
buildResult.RuntimeWorker:catch(function(err)
	warn("A script failed to execute: " .. tostring(err))
end)
```

## Best practices

* Only one LocalScript, if any, should manage execution in your project
* Code should not rely on external instances, like CollectionService, to function unless specifically designed to do so
* LocalScripts should try to finish ASAP, and avoid yielding the main thread if possible
* The codebase should never be exposed to the `game` object to prevent security vulnerabilities
