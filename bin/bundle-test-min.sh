#!/usr/bin/env bash

# Save newline as a tab
printf -v nl '\n'

# Wrap the given file in a function declaration.
wrap_function_decl() {
	local name="$1"
	local file="$2"

	# Get file source
	local content=$(cat $file)

	# Replace '_G' variable with 'TS._G'
	content=${content//_G\[script\]/"TS._G[script]"}

	# Add tab to newlines
	content=${content//${nl}/$nl	}

	echo "${nl}TS.register(\"$file\", \"$name\", function()
    local script = TS.get(\"$file\")
    ${content}
end)"
}

bundle=$(cat 'bin/runtime.lua')

traverse() {
	local dir="$1"

	# Do files first
	for file in "$dir"/*; do
		if [ -f "$file" ]; then
			filename=$(basename -- "$file")
			extension="${filename##*.}"
			filename="${filename%%.*}"
			if [ "$extension" = 'lua' ]; then
				bundle+=$(wrap_function_decl "$filename" "$file")
			fi
		fi
	done

	# Do folders last
	for file in "$dir"/*; do
		if [ -d "$file" ]; then
			traverse "$file"
		fi
	done
}

# Load all Lua files
traverse 'out'

# End by returning the main module
bundle+="${nl}return TS.initialize(\"init\")"

# Generate an output by removing all compound assignments and minifying the source
output=$(echo "${bundle}" | sed -E 's/(([A-z0-9_]+\.)*[A-z_][A-z0-9_]*)\s*(\.\.|\+|\-|\*|\/|\%|\^)\=/\1 = \1 \3/g' | npx luamin -c)

# Finalize the test code
output="local Rostruct = (function() ${output} end)()${nl}${nl}"
output+="$nl$(cat 'bin/test.lua' | sed 's/local Rostruct = TS.initialize("init")//g')"

# Clear any existing Rostruct.lua file
>Rostruct.lua

echo "$output" >>Rostruct.lua
