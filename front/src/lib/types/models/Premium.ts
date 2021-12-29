interface LimitModel {
	key: string,
	options?: {
		[key: string]: number | string
	}
}

interface FeatureModel {
	text: LimitModel
	limits?: Array<LimitModel>
}

export interface PlanModel {
	id: string,
	price: number,
	available: boolean,
	piece: string,
	features: Array<FeatureModel>
}