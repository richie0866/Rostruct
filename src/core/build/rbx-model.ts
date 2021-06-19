import { getContentId } from "api";

/**
 * Transforms a `.rbxm` or `.rbxmx` file into a Roblox object.
 * @param sessionId The current session.
 * @param path A path to the model file.
 * @param name The name of the instance.
 * @returns The result of `game.GetObjects(getContentId(path))`.
 */
export function makeRobloxModel(path: string, name: string): Instance {
	assert(getContentId, `'${path}' could not be loaded; No way to get a content id`);

	// A cool trick to load model files is to generate a content ID, which
	// saves it to Roblox's content folder. Thus, it can be called as an
	// argument for GetObjects.
	const tree = game.GetObjects(getContentId(path));
	assert(tree.size() === 1, `'${path}' could not be loaded; Only one top-level instance is supported`);

	const obj = tree[0];
	obj.Name = name;

	return obj;
}
