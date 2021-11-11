import { readdir } from "fs/promises"
import { resolve } from "path"
import { Collection } from "discord.js"

async function bulkImport<T>(directory: string, useDefault?: boolean): Promise<Collection<string, T>> {
	const objects = new Collection<string, T>()

	const files = await readdir(directory)
	for (const file of files) {
		if (file.toLowerCase().endsWith(".ts")) {
			const name = file.split(".").slice(0, -1).join(".")
			const object = await import(resolve(directory, file))
			objects.set(name, useDefault ? object.default : object)
		}
	}

	return objects
}

export default bulkImport