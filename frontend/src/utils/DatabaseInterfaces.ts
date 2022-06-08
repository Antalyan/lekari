export interface IDatBasicDoctor {
    id: number,
    degree: string,
    firstname: string,
    surname: string,
    specialization: string,
    city: string,
    actuality?: string,
    profile_picture?: string
}

export interface IDatPatientProfile {
    firstname: string,
    surname: string,
    degree?: string,
    birthdate: string,
    email: string,
    phonePrefix: string,
    phone: number,
    insuranceNumber?: number,
    country: string,
    city: string,
    postalCode: number,
    street?: string,
    buildingNumber: string,
    password1?: string,
    password2?: string
    // oldPassword?: string,
    // newPassword?: string,
    // passwordCheck?: string,
    // profilePicture: string,
}


export interface IDatDoctorProfile {
    firstname: string,
    surname: string,
    degree?: string,
    birthdate: string,
    email: string,
    phonePrefix: string,
    phone: number,
    insuranceNumber?: number,
    country: string,
    city: string,
    postalCode: number,
    street?: string,
    buildingNumber: string,
    password1?: string,
    password2?: string
    // oldPassword?: string,
    // newPassword?: string,
    // passwordCheck?: string,
    // profilePicture: string,
    specialization: string,
    actuality?: string,
    workStreet?: string,
    workBuildingNumber?: string,
    workCity: string,
    workPostalCode: number,
    workCountry: string,
}

export interface IDatTmpRes {
    firstname: string,
    surname: string,
    degree?: string,
    birthdate?: string,
    email?: string,
    phonePrefix?: string,
    phone?: number,
    insuranceNumber?: number,
    country?: string,
    city?: string,
    postalCode?: number,
    street?: string,
    buildingNumber?: string,
    date: string,
    time: string,
    comment?: string
}


export interface IDatPersonReservation {
    id: number,
    doctorDegree?: string,
    doctorFirstname: string,
    doctorSurname: string,
    visitTimeFrom: string,
    visitTimeTo: string,
    visitDate: string,
    note?: string,
    createTime: string,
    createDate: string,
    workStreet?: string,
    workBuildingNumber: string,
    workCity: string,
}

export interface IDatDoctorReservation {
    id: number,
    personDegree?: string,
    personFirstname: string,
    personSurname: string,
    visitTimeFrom: string,
    visitTimeTo: string,
    visitDate: string,
    note?: string,
    createTime: string,
    createDate: string,
}

export interface IDatReview {
    rate?: number,
    comment?: string,
    author?: string,
    createDate?: string,
    createTime?: string,
}

export interface IDatDoctorDetail {
    degree?: string,
    firstname: string,
    surname: string,
    specialization: string,
    actuality?: string,
    workEmail?: string,
    workPhone?: number,
    description: string,
    link: string,
    languages: string[]
    workCountry: string,
    workCity: string,
    workPostalCode: number,
    workStreet?: string,
    workBuildingNumber: string,
    profilePicture?: string
    openingHours: string[],
    reviews: IDatReview[],
    rateAverage: number
}

export interface IDatDoctorInfo {
    workEmail?: string,
    workPhone?: number,
    description?: string,
    link?: string,
    languages: string[]
    openingHours: (string | undefined)[],
}

export interface IDatResCreate {
    date: string,
    time: string,
    comment?: string
}


