import { getContentId } from "api";
import type { Session } from "core/Session";
import { VirtualScript } from "core/VirtualScript";

type ScriptWithSource = LuaSourceContainer & { Source: string };

/**
 * Transforms a `.rbxm` or `.rbxmx` file into a Roblox object.
 * @param path A path to the model file.
 * @param name The name of the instance.
 * @returns The result of `game.GetObjects(getContentId(path))`.
 */
export function makeRobloxModel(session: Session, path: string, name: string): Instance {
	assert(getContentId, `'${path}' could not be loaded; No way to get a content id`);

	// A neat trick to load model files is to generate a content ID, which
	// moves it to Roblox's content folder, and then use it as the asset id for
	// for GetObjects:
	const tree = game.GetObjects(getContentId(path));
	assert(tree.size() === 1, `'${path}' could not be loaded; Only one top-level instance is supported`);

	const model = tree[0] as Instance | ScriptWithSource;
	model.Name = name;

	// Create VirtualScript objects for all scripts in the model
	for (const obj of model.GetDescendants() as (Instance | ScriptWithSource)[]) {
		if (obj.IsA("LuaSourceContainer")) {
			session.virtualScriptAdded(new VirtualScript(obj, path, session.root, obj.Source));
		}
	}
	if (model.IsA("LuaSourceContainer")) {
		session.virtualScriptAdded(new VirtualScript(model, path, session.root, model.Source));
	}

	return model;
}
