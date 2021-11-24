export interface ChessSearchResultItemModel {
	slug: string
	name: string
	createdAt: string
	moveCount?: number
}

export interface ChessSearchQueryData {
	chessSearch: [ChessSearchResultItemModel]
}