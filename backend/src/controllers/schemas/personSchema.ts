import { date, number, object, string } from 'yup';

const personSchema = object({
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

const personTmpSchema = object({
  firstname: string()
    .required(),
  surname: string()
    .required(),
  degree: string(),
  birthdate: date()
    .required(),
  email: string()
    .email(),
  phonePrefix: string()
    .required(),
  phone: number()
    .required(),
  insuranceNumber: number(),
  country: string(),
  city: string(),
  postalCode: number(),
  street: string(),
  buildingNumber: string(),
  date: string()
    .required(),
  time: string()
    .required(),
  comment: string()
});

const passwordSchema = object({
  password1: string()
    .required(),
  password2: string()
    .required(),
});

const loginSchema = object({
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
  password1: string(),
  password2: string(),
});

const personUpdateSchema = personSchema.shape(updatePasswordSchema.fields);
const personRegistrationSchema = personSchema.shape(passwordSchema.fields);

export default {
  personSchema,
  personTmpSchema,
  loginSchema,
  personUpdateSchema,
  personRegistrationSchema
};
