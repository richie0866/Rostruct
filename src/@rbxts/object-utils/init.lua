local HttpService = game:GetService("HttpService")

local Object = {}

function Object.keys(object)
	local result = table.create(#object)
	for key in pairs(object) do
		result[#result + 1] = key
	end
	return result
end

function Object.values(object)
	local result = table.create(#object)
	for _, value in pairs(object) do
		result[#result + 1] = value
	end
	return result
end

function Object.entries(object)
	local result = table.create(#object)
	for key, value in pairs(object) do
		result[#result + 1] = { key, value }
	end
	return result
end

function Object.assign(toObj, ...)
	for i = 1, select("#", ...) do
		local arg = select(i, ...)
		if type(arg) == "table" then
			for key, value in pairs(arg) do
				toObj[key] = value
			end
		end
	end
	return toObj
end

function Object.copy(object)
	local result = table.create(#object)
	for k, v in pairs(object) do
		result[k] = v
	end
	return result
end

local function deepCopyHelper(object, encountered)
	local result = table.create(#object)
	encountered[object] = result

	for k, v in pairs(object) do
		if type(k) == "table" then
			k = encountered[k] or deepCopyHelper(k, encountered)
		end

		if type(v) == "table" then
			v = encountered[v] or deepCopyHelper(v, encountered)
		end

		result[k] = v
	end

	return result
end

function Object.deepCopy(object)
	return deepCopyHelper(object, {})
end

function Object.deepEquals(a, b)
	-- a[k] == b[k]
	for k in pairs(a) do
		local av = a[k]
		local bv = b[k]
		if type(av) == "table" and type(bv) == "table" then
			local result = Object.deepEquals(av, bv)
			if not result then
				return false
			end
		elseif av ~= bv then
			return false
		end
	end

	-- extra keys in b
	for k in pairs(b) do
		if a[k] == nil then
			return false
		end
	end

	return true
end

function Object.toString(data)
	return HttpService:JSONEncode(data)
end

function Object.isEmpty(object)
	return next(object) == nil
end

function Object.fromEntries(entries)
	local entriesLen = #entries

	local result = table.create(entriesLen)
	if entries then
		for i = 1, entriesLen do
			local pair = entries[i]
			result[pair[1]] = pair[2]
		end
	end
	return result
end

return Object
