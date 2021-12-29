export interface CommunicationEnrollmentModel {
	name: string
}

export interface UserModel {
	uid: string
}

export interface CommunicationEnrollmentsQueryData {
	communicationEnrollments: Array<CommunicationEnrollmentModel>
}