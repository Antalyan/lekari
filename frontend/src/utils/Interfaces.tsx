import {DataFormType} from "../data/Constants";

export interface IBasicDoctor {
    id: number,
    name: string,
    specialization: string,
    location: string,
    actuality: string,
    rating?: number
}

export interface ILogin {
    email: string,
    password: string
}

export interface IFormPerson {
    id?: number,
    name: string,
    surname: string,
    degree: string,
    birthdate: Date,
    street: string,
    streetNumber?: number,
    city: string,
    postalCode?: number,
    country: string,
    email: string,
    phoneCode?: number,
    phone?: number,
    insuranceNumber?: number,
    oldPassword?: string,
    newPassword?: string,
    passwordCheck?: string,
    profilePicture: string,
    specialization: string,
    status?: string,
    doctorStreet?: string,
    doctorStreetNumber?: number,
    doctorCity?: string,
    doctorPostalCode?: number,
    doctorCountry?: string,
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
    type: DataFormType,
    isEdit: boolean
}

export interface IGlobalProfileInfo {
    id?: number,
    name?: string,
    surname?: string,
    profilePicture?: string,
    isDoctor?: boolean
}

export interface IReservation {
    id?: number,
    patientID: number,
    doctorID: number,
    patientName: string,
    doctorName: string,
    creationAt: Date,
    visitDate: Date,
    address: string,
    note?: string
}

export interface IReservationBasic {
    reservationDate: Date,
    reservationTime: string,
    reservationNote?: string
}

export interface IFormFieldProps {
    isEdit: boolean,
    name: string,
    label?: string,
    type?: string,
    required?: boolean,
    fullWidth?: boolean,
    validation?: any
    options?: any[] | undefined
}

export interface IReservationSlots {
    fromDate: Date,
    toDate: Date,
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
    interval: number
}
