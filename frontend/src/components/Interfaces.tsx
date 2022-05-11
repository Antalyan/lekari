export interface IBasicDoctor {
    name: string,
    specialization: string,
    location: string,
    actuality: string
    id: number
}

export interface ILogin {
    email: string,
    password: string
}

export interface IPatient {
    title: string,
    name: string,
    surname: string,
    street: string,
    streetNumber?: number,
    city: string,
    postalCode?: number,
    country: string,
    birthdate: Date,
    email: string,
    phoneCode?: number,
    phone?: number,
    insuranceNumber?: number,
    password: string,
    passwordCheck: string,
    profilePicture: string
}
