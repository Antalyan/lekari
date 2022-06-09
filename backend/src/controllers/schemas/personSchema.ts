import { date, number, object, string } from 'yup';

const personSchema = object({
  firstname: string()
    .required(),
  surname: string()
    .required(),
  degree: string()
    .nullable(),
  birthdate: date()
    .required(),
  email: string()
    .email()
    .required(),
  phonePrefix: string()
    .required(),
  phone: number()
    .required(),
  insuranceNumber: number()
    .nullable(),
  country: string()
    .required(),
  city: string()
    .required(),
  postalCode: number()
    .required(),
  street: string()
    .nullable(),
  buildingNumber: string()
    .required(),
});

const tmp = object({
  firstname: string()
    .required(),
  surname: string()
    .required(),
  degree: string()
    .nullable(),
  birthdate: date()
    .required(),
  email: string()
    .email(),
  phonePrefix: string()
    .required(),
  phone: number()
    .required(),
  insuranceNumber: number()
    .nullable(),
  country: string()
    .nullable(),
  city: string()
    .nullable(),
  postalCode: number()
    .nullable(),
  street: string()
    .nullable(),
  buildingNumber: string()
    .nullable(),
  date: string()
    .required(),
  time: string()
    .required(),
  comment: string()
    .nullable()
});

const passwordSchema = object({
  password1: string()
    .required(),
  password2: string()
    .required(),
});

const login = object({
  email: string()
    .email()
    .required(),
  password: string()
    .required(),
});

const updatePasswordSchema = object({
  oldPassword: string()
    .nullable(),
  password1: string()
    .nullable(),
  password2: string()
    .nullable(),
});

const update = personSchema.shape(updatePasswordSchema.fields);
const registration = personSchema.shape(passwordSchema.fields);

export default {
  personSchema,
  tmp,
  login,
  update,
  registration
};
