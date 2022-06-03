export interface IDatabaseDoctor {
    name: string,
    specialization: string,
    location: string,
    actuality: string,
    profile_picture: string
}

export interface IDatabasePatient {
    firstname: string,
    surname: string,
    degree?: string,
    birthdate: Date,
    street: string,
    buildingNumber?: string,
    city: string,
    postalCode?: number,
    country: string,
    email: string,
    phonePrefix?: string,
    phone?: number,
    insuranceNumber?: number,
    password1: string,
    password2: string
    // oldPassword?: string,
    // newPassword?: string,
    // passwordCheck?: string,
    // profilePicture: string,
    // specialization: string,
    // status?: string,
    // doctorStreet?: string,
    // doctorStreetNumber?: number,
    // doctorCity?: string,
    // doctorPostalCode?: number,
    // doctorCountry?: string,
}


export interface IDatabaseDoctor {
    firstname: string,
    surname: string,
    degree?: string,
    birthdate: Date,
    street: string,
    buildingNumber?: string,
    city: string,
    postalCode?: number,
    country: string,
    email: string,
    phonePrefix?: string,
    phone?: number,
    insuranceNumber?: number,
    password1: string,
    password2: string
    profilePicture: string,
    specialization: string,
    status?: string,
    doctorStreet?: string,
    doctorStreetNumber?: number,
    doctorCity?: string,
    doctorPostalCode?: number,
    doctorCountry?: string,
}



