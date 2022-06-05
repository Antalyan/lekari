export interface IDatBasicDoctor {
    name: string,
    specialization: string,
    location: string,
    actuality: string,
    profile_picture: string
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



