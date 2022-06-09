import personSchema from './personSchema';
import { array, number, object, string } from 'yup';

const doctorSchema = object({
  specialization: string()
    .required(),
  actuality: string()
    .nullable(),
  workCountry: string()
    .required(),
  workCity: string()
    .required(),
  workPostalCode: number()
    .required(),
  workStreet: string()
    .nullable(),
  workBuildingNumber: string()
    .required(),
});

const details = object({
  openingHours: array()
    .of(
      string()
        .nullable()
    ),
  languages: array()
    .of(
      string()
    ),
  workEmail: string()
    .email(),
  workPhone: string()
    .nullable(),
  description: string()
    .nullable(),
  link: string()
    .nullable(),
});

const review = object({
  author: string(),
  rate: number()
    .min(0)
    .max(5)
    .required(),
  comment: string()
});

const registration = personSchema.registration.shape(doctorSchema.fields);

const update = personSchema.update.shape(doctorSchema.fields);

export default {
  registration,
  details,
  update,
  review
};
