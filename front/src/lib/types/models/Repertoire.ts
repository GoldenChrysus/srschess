export interface RepertoireReviewModel {
	moveId?: string,
	incorrectAttempts: number,
	attempts: number,
	averageCorrectTime: number,
	averageTime: number
}

export interface RepertoireMoveModel {
	id: string,
	fen: string,
	uci: string,
	moveNumber: number,
	move: string,
	sort: number,
	parentId?: string | null,
	transpositionId?: string | null,
}

export interface RepertoireLessonItemModel {
	id: string,
	parentId: string | null,
	move: string,
	uci: string,
	movelist: string
}

export interface RepertoireModel {
	id: number,
	slug?: string,
	name: string,
	side: string,
	moves?: Array<RepertoireMoveModel> | null,
	lessonQueueLength?: number,
	lessonQueue?: Array<RepertoireLessonItemModel>
}