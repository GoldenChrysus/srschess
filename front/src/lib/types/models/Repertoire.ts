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

export interface RepertoireQueueItemModel {
	id: string,
	parentId: string | null,
	move: string,
	uci: string,
	movelist: string,
	similarMoves?: string | null
}

export interface RepertoireModel {
	id: number,
	slug?: string,
	name: string,
	side: string,
	public: boolean,
	moves?: Array<RepertoireMoveModel> | null,
	lessonQueueLength?: number,
	lessonQueue?: Array<RepertoireQueueItemModel>,
	reviewQueueLength?: number,
	reviewQueue?: Array<RepertoireQueueItemModel>,
	nextReview?: string | null
}

export interface RepertoireQueryData {
	repertoire: RepertoireModel | null
}

export interface RepertoiresQueryData {
	repertoires: Array<RepertoireModel>
}