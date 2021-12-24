export interface EcoPositionModel {
	id: number,
	slug: string,
	fen: string,
	pgn: string,
	code: string,
	name: string
}

export interface FenEcoQueryData {
	fenEco: EcoPositionModel
}

export interface EcoPositionQueryData {
	ecoPositions: Array<EcoPositionModel>
}