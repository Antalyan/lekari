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

export const loginSchema = object({
  email: string()
    .email()
    .required(),
  password: string()
    .required(),
});

/*
TODO: Finnish validation in this style.
.when(['newPassword1', 'newPassword2'], {
    is: (newPassword1, newPassword2) => newPassword1 && newPassword2,
    then: string().required('Required'),
    otherwise: string()
  })
*/
const updatePasswordSchema = object({
  oldPassword: string(),
  newPassword1: string(),
  newPassword2: string(),
});

export const personUpdateSchema = personSchema.shape(updatePasswordSchema.fields)
export const personRegistrationSchema = personSchema.shape(passwordSchema.fields);
