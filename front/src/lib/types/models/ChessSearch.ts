export interface ChessSearchResultItemModel {
	slug: string
	name: string
	createdAt: string
	moveCount?: number
	result?: number
	event?: string
	round?: string
}

export interface ChessSearchQueryData {
	chessSearch: [ChessSearchResultItemModel]
}