import { personRegistrationSchema, personUpdateSchema } from './personSchema';
import { array, number, object, string } from 'yup';

export const doctorSchema = object({
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

const doctorDetailsSchema = object({
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

export const doctorRegistrationSchema = personRegistrationSchema.shape(doctorSchema.fields);

export const doctorUpdateSchema = personUpdateSchema.shape(doctorSchema.fields);

export default {
  doctorRegistrationSchema,
  doctorDetailsSchema
};
