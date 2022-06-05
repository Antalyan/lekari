import { personRegistrationSchema } from './personSchema';
import { number, string } from 'yup';

export const doctorRegistrationSchema = personRegistrationSchema.shape({
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

export default doctorRegistrationSchema;
