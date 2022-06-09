export interface IDoctorCard {
    id: number,
    name: string,
    specialization: string,
    location: string,
    actuality?: string,
    rating?: number
}

export interface IFilter {
    specialization: string,
    location: string,
}

export interface IFormPerson {
    id?: number,
    name: string,
    surname: string,
    degree?: string,
    birthdate: string,
    street?: string,
    streetNumber: string,
    city: string,
    postalCode: string,
    country: number,
    email: string,
    phoneCode: number,
    phone: string,
    insuranceNumber?: string,
    oldPassword?: string,
    newPassword?: string,
    passwordCheck?: string,
    profilePicture: string,
    // doctor attributes are all optional (because it may not be doctor)
    specialization?: number,
    status?: string,
    doctorStreet?: string,
    doctorStreetNumber?: string,
    doctorCity?: string,
    doctorPostalCode?: string,
    doctorCountry?: number,
}

export interface IFormRes {
    id?: number,
    name: string,
    surname: string,
    degree?: string,
    birthdate?: string,
    street?: string,
    streetNumber?: string,
    city?: string,
    postalCode?: string,
    country?: number,
    email?: string,
    phoneCode: number,
    phone: string,
    insuranceNumber?: string,
}

export interface IEditable {
    editable: boolean
}

export interface IReview {
    author?: string,
    createDate?: string,
    createTime?: string,
    rating?: number,
    text?: string,
    id?: number
}

export interface IReviewList {
    reviews: IReview[]
}

export interface IGlobalProfileInfo {
    id?: number,
    firstName?: string,
    surname?: string,
    profilePicture?: string,
    token?: string,
    isDoctor?: boolean
}

export interface IReservation {
    id?: number,
    patientName?: string,
    doctorName?: string,
    createTime: string,
    createDate: string,
    visitTimeFrom: string,
    visitTimeTo: string,
    visitDate: string,
    doctorAddress?: string,
    note?: string
}

export interface IReservationSlots {
    fromDate?: Date,
    interval?: number,
    timeFrom1?: string,
    timeFrom2?: string,
    timeFrom3?: string,
    timeFrom4?: string,
    timeFrom5?: string,
    timeFrom6?: string,
    timeFrom7?: string,
    timeTo1?: string,
    timeTo2?: string,
    timeTo3?: string,
    timeTo4?: string,
    timeTo5?: string,
    timeTo6?: string,
    timeTo7?: string,
}

export interface IDoctorDetailInfo {
    email?: string,
    phone?: string,
    web?: string
    languages: string[]
    description?: string
    openingHours0?: string,
    openingHours1?: string,
    openingHours2?: string,
    openingHours3?: string,
    openingHours4?: string,
    openingHours5?: string,
    openingHours6?: string,
}

export interface ISelectItem {
    id: string,
    title?: string
}

export interface IReservationBasic {
    reservationDate: string,
    reservationTime: string,
    reservationNote?: string
}
