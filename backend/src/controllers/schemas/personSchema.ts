import { date, number, object, string } from 'yup';

export const personSchema = object({
  firstname: string()
    .required(),
  surname: string()
    .required(),
  degree: string(),
  birthdate: date()
    .required(),
  email: string()
    .email()
    .required(),
  phonePrefix: string()
    .required(),
  phone: number()
    .required(),
  insuranceNumber: number(),
  country: string()
    .required(),
  city: string()
    .required(),
  postalCode: number()
    .required(),
  street: string(),
  buildingNumber: string()
    .required(),
});

const passwordSchema = object({
  password1: string()
    .required(),
  password2: string()
    .required(),
});

export const personRegistrationSchema = personSchema.shape(passwordSchema.fields);
