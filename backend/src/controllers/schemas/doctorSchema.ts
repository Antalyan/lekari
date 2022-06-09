import { personRegistrationSchema, personUpdateSchema } from './personSchema';
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

const doctorRegistrationSchema = personRegistrationSchema.shape(doctorSchema.fields);

const doctorUpdateSchema = personUpdateSchema.shape(doctorSchema.fields);

export default {
  doctorRegistrationSchema,
  details,
  doctorUpdateSchema
};
