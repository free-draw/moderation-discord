import SnapshotLogType from "../enum/SnapshotLogType"

type SnapshotPlayerData = {
	userId: number,
	position: { x: number, y: number },
}

type SnapshotLogData = {
	userId: number,
	type: SnapshotLogType,
	data?: string | { content: string, type: string, filtered?: boolean },
}

type SnapshotCanvasData = {
	userId: number,
	data: string,
}

type SnapshotData = {
	players: SnapshotPlayerData[],
	logs: SnapshotLogData[],
	canvas: SnapshotCanvasData[],
}

class Snapshot {
	constructor(data: SnapshotData) {
		
	}
}

export default Snapshot
export { Snapshot, SnapshotData }