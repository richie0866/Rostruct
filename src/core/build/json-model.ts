import Make from "modules/make";
import { HttpService } from "modules/services";
import EncodedValue from "./EncodedValue";

type CreatableInstanceName = keyof CreatableInstances;
type CreatableInstance = CreatableInstances[CreatableInstanceName];

interface JsonModel {
	ClassName: CreatableInstanceName;
	Name?: string;
	Properties?: Map<keyof WritableInstanceProperties<CreatableInstance>, EncodedValue>;
	Children?: JsonModel[];
}

/**
 * Recursively generates Roblox instances from the given model data.
 * @param modelData The properties and children of the model.
 * @param path A path to the model file for debugging.
 * @param name The name of the model file, for the top-level instance only.
 * @returns An Instance created with the model data.
 */
function jsonModel(modelData: JsonModel, path: string, name?: string): CreatableInstance {
	// The 'Name' field is required for all other instances.
	assert(name ?? modelData.Name, `A child in the model file '${path}' is missing a Name field`);

	if (name !== undefined && modelData.Name !== undefined && modelData.Name !== name)
		warn(`The name of the model file at '${path}' (${name}) does not match the Name field '${modelData.Name}'`);

	// The 'ClassName' field is required.
	assert(modelData.ClassName !== undefined, `An object in the model file '${path}' is missing a ClassName field`);

	const obj = Make(modelData.ClassName, { Name: name ?? modelData.Name });

	if (modelData.Properties) EncodedValue.setModelProperties(obj, modelData.Properties);

	if (modelData.Children)
		for (const entry of modelData.Children) {
			const child = jsonModel(entry, path);
			child.Parent = obj;
		}

	return obj;
}

/**
 * Transforms a JSON model file into a Roblox object.
 * @param path A path to the JSON file.
 * @param name The name of the instance.
 * @returns An Instance created from the JSON model file.
 */
export function makeJsonModel(path: string, name: string): Instance {
	return jsonModel(HttpService.JSONDecode<JsonModel>(readfile(path)), path, name);
}
