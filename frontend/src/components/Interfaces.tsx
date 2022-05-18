import {DataFormType} from "../data/Constants";

export interface IBasicDoctor {
    name: string,
    specialization: string,
    location: string,
    actuality: string,
    id: number,
    rating?: number
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

export interface IContact {
    email: string,
    phone: string,
    web: string
}

export interface IEditable {
    editable: boolean
}

export interface IReview {
    name?: string,
    date: Date,
    rating: number,
    text: string,
    id?: number
}

export interface IForm {
    type: DataFormType
}

export interface IOpeningHour {
    editable: boolean,
    texts: Array<string>
}
