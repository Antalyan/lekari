import personSchema from './personSchema';
import { array, number, object, string } from 'yup';

const doctorSchema = object({
  specialization: string()
    .required(),
  actuality: string(),
  workCountry: string()
    .required(),
  workCity: string()
    .required(),
  workPostalCode: number()
    .required(),
  workStreet: string(),
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
  workPhone: string(),
  description: string(),
  link: string(),
});

const registration = personSchema.registration.shape(doctorSchema.fields);

const update = personSchema.update.shape(doctorSchema.fields);

export default {
  registration,
  details,
  update
};
