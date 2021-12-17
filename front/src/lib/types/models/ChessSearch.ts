export interface ChessSearchResultItemModel {
	slug: string
	name: string
	createdAt: string
	moveCount?: number
	result?: number
}

export interface ChessSearchQueryData {
	chessSearch: [ChessSearchResultItemModel]
}