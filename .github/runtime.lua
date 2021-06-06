local TS = {
	_G = {};
}

setmetatable(TS, {
	__index = function(self, k)
		if k == "Promise" then
			self.Promise = TS.initialize("packages", "Promise")
			return self.Promise
		end
	end
})

-- Runtime classes
local FilePtr
do
	FilePtr = {}
	FilePtr.__index = FilePtr

	function FilePtr.new(path)
		local fileName, slash = string.match(path, "([^/]+)(/*)$")
		return setmetatable({
			name = fileName,
			path = string.sub(path, 1, -#fileName - (slash ~= "" and 2 or 1)),
		}, FilePtr)
	end

	function FilePtr:__index(k)
		if k == "Parent" then
			return FilePtr.new(self.path)
		end
	end

end

local Module
do
	Module = {}
	Module.__index = Module

	function Module.new(path, name, func)
		return setmetatable({
			path = path,
			name = name,
			func = func,
			data = nil;
		}, Module)
	end

	function Module:__index(k)
		if Module[k] then
			return Module[k]
		elseif k == "Parent" then
			return FilePtr.new(self.path)
		elseif k == "Name" then
			return self.path
		end
	end

	function Module:require()
		if not self.data then
			self.data = assert(self.func(), "Module at '" .. self.path .. "' did not return exactly one value")
			self.func = nil
		end
		return self.data
	end

	function Module:GetFullName()
		return self.path
	end

end

local Symbol
do
	Symbol = {}
	Symbol.__index = Symbol
	setmetatable(
		Symbol,
		{
			__call = function(_, description)
				local self = setmetatable({}, Symbol)
				self.description = "Symbol(" .. (description or "") .. ")"
				return self
			end,
		}
	)

	local symbolRegistry = setmetatable(
		{},
		{
			__index = function(self, k)
				self[k] = Symbol(k)
				return self[k]
			end,
		}
	)

	function Symbol:toString()
		return self.description
	end

	Symbol.__tostring = Symbol.toString

	-- Symbol.for
	function Symbol.getFor(key)
		return symbolRegistry[key]
	end

	function Symbol.keyFor(goalSymbol)
		for key, symbol in pairs(symbolRegistry) do
			if symbol == goalSymbol then
				return key
			end
		end
	end
end

TS.Symbol = Symbol
TS.Symbol_iterator = Symbol("Symbol.iterator")

-- Provides a way to attribute modules to files.
local modulesByPath = {}
local modulesByName = {}

-- Bundle compatibility
function TS.register(path, name, func)
	local module = Module.new(path, name, func)
	modulesByPath[path] = module
	modulesByName[name] = module
	return module
end

function TS.get(path)
	return modulesByPath[path]
end

function TS.initialize(path)
	local symbol = setmetatable({}, {__tostring = function()
		return "root"
	end})
	local caller = TS.register(symbol, symbol)
	return TS.import(caller, { path = "out/" }, path)
end

-- module resolution
function TS.getModule(_object, _moduleName)
	return error("TS.getModule is not supported yet", 2)
end

-- This is a hash which TS.import uses as a kind of linked-list-like history of [Script who Loaded] -> Library
local currentlyLoading = {}
local registeredLibraries = {}

function TS.import(caller, parentPtr, ...)
	-- Caller may be an init file, so if that's true, just look in the parent
	if caller == parentPtr then
		parentPtr = caller.Parent
	end
	
	-- Because 'Module.Parent' returns a FilePtr, the module handles the indexing.
	-- Getting 'parentPtr.path' will return the result of FilePtr.Parent...
	local modulePath = parentPtr.path .. table.concat({...}, "/") .. ".lua"
	local initModulePath = parentPtr.path .. table.concat({...}, "/") .. "/init.lua"
	local module = assert(
		modulesByPath[modulePath] or modulesByPath[initModulePath],
		"No module exists at path '" .. modulePath .. "'"
	)

	currentlyLoading[caller] = module

	-- Check to see if a case like this occurs:
	-- module -> Module1 -> Module2 -> module

	-- WHERE currentlyLoading[module] is Module1
	-- and currentlyLoading[Module1] is Module2
	-- and currentlyLoading[Module2] is module

	local currentModule = module
	local depth = 0

	while currentModule do
		depth = depth + 1
		currentModule = currentlyLoading[currentModule]

		if currentModule == module then
			local str = currentModule.name -- Get the string traceback

			for _ = 1, depth do
				currentModule = currentlyLoading[currentModule]
				str ..= " => " .. currentModule.name
			end

			error("Failed to import! Detected a circular dependency chain: " .. str, 2)
		end
	end

	if not registeredLibraries[module] then
		if TS._G[module] then
			error(
				"Invalid module access! Do you have two TS runtimes trying to import this? " .. module.path,
				2
			)
		end

		TS._G[module] = TS
		registeredLibraries[module] = true -- register as already loaded for subsequent calls
	end

	local data = module:require()

	if currentlyLoading[caller] == module then -- Thread-safe cleanup!
		currentlyLoading[caller] = nil
	end

	return data
end

-- general utility functions
function TS.async(callback)
	local Promise = TS.Promise
	return function(...)
		local n = select("#", ...)
		local args = { ... }
		return Promise.new(function(resolve, reject)
			coroutine.wrap(function()
				local ok, result = pcall(callback, unpack(args, 1, n))
				if ok then
					resolve(result)
				else
					reject(result)
				end
			end)()
		end)
	end
end

function TS.await(promise)
	local Promise = TS.Promise
	if not Promise.is(promise) then
		return promise
	end

	local status, value = promise:awaitStatus()
	if status == Promise.Status.Resolved then
		return value
	elseif status == Promise.Status.Rejected then
		error(value, 2)
	else
		error("The awaited Promise was cancelled", 2)
	end
end
