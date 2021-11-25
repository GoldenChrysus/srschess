export interface EcoPositionModel {
	id: number,
	code: string,
	name: string
}

export interface FenEcoQueryData {
	fenEco: EcoPositionModel
}

export interface EcoPositionQueryData {
	ecoPositions: Array<EcoPositionModel>
}