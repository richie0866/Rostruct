import Make from "modules/make/init";
import { HttpService } from "modules/services";
import EncodedValue from "./EncodedValue";

type CreatableInstanceName = keyof CreatableInstances;
type CreatableInstance = CreatableInstances[CreatableInstanceName];

interface Metadata {
	className?: CreatableInstanceName;
	properties?: Map<keyof WritableInstanceProperties<CreatableInstance>, EncodedValue>;
}

/**
 * Applies the given `*.meta.json` file to the `instance`.
 *
 * Note that init scripts call this function if there is
 * an `init.meta.json` present.
 *
 * @param metaPath A path to the meta file.
 * @param instance The instance to apply properties to.
 */
export function fileMetadata(metaPath: string, instance: Instance) {
	const metadata = HttpService.JSONDecode<Metadata>(readfile(metaPath));

	// Cannot modify the className of an existing instance:
	assert(
		metadata.className === undefined,
		"className can only be specified in init.meta.json files if the parent directory would turn into a Folder!",
	);

	// Uses Rojo's decoder to set properties from metadata.
	if (metadata.properties !== undefined) EncodedValue.setProperties(instance, metadata.properties);
}

/**
 * Creates an Instance from the given `init.meta.json` file.
 *
 * Note that this function does not get called for directories
 * that contain init scripts. We can assume that there are no
 * init scripts present.
 *
 * @param metaPath A path to the meta file.
 * @param name The name of the folder.
 * @returns A new Instance.
 */
export function directoryMetadata(metaPath: string, name: string): CreatableInstance {
	const metadata = HttpService.JSONDecode<Metadata>(readfile(metaPath));

	// If instance isn't provided, className is never undefined.
	const instance = Make(metadata.className!, { Name: name });

	// Uses Rojo's decoder to set properties from metadata.
	if (metadata.properties !== undefined) EncodedValue.setProperties(instance, metadata.properties);

	return instance;
}
