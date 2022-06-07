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

export default personSchema;
