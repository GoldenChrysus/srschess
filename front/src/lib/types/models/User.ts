export interface CommunicationEnrollmentModel {
	name: string
}

export interface UserModel {
	id: number
	uid: string
	tier: number
}

export interface CommunicationEnrollmentsQueryData {
	communicationEnrollments: Array<CommunicationEnrollmentModel>
}

export interface CreateUserMutationData {
	createUser: {
		user: UserModel,
		errors: string[]
	}
}