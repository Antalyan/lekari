import { personRegistrationSchema, personUpdateSchema } from './personSchema';
import { number, string, object } from 'yup';

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
})

export const doctorRegistrationSchema = personRegistrationSchema.shape(doctorSchema.fields);

export const doctorUpdateSchema = personUpdateSchema.shape(doctorSchema.fields);

export default doctorRegistrationSchema;
