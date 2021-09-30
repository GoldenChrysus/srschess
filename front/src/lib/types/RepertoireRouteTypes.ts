export interface RepertoireRouteMove {
	id: string,
	fen: string,
	uci: string,
	moveNumber: number,
	move: string,
	sort: number,
	parentId?: string | null,
	transpositionId?: string | null,
}

export interface RepertoireRouteLessonItem {
	id: string,
	parentId: string | null,
	move: string,
	uci: string,
	movelist: string
}

export interface RepertoireRouteRepertoire {
	id: number,
	name: string,
	side: string,
	moves?: Array<RepertoireRouteMove> | null,
	lessonQueueLength?: number,
	lessonQueue?: Array<RepertoireRouteLessonItem>
}