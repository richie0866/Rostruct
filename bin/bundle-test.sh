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

	echo "$nl$nl-- $file:
TS.register(\"$file\", \"$name\", function()

    -- Setup
    local script = TS.get(\"$file\")

    -- Start of $name

    ${content}

    -- End of $name

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

traverse 'out'

bundle+="$nl$(cat 'bin/test.lua')"

>Rostruct.lua
echo "${bundle}" >>Rostruct.lua
