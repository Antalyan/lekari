import { number, string, object, array } from 'yup';

export const doctorDetailsSchema = object({
  openingHours: array().of(
      string().nullable()
  ),
  languages: array().of(
    string()
  ),
  email: string().email(),
  phone: string(),
  description: string(),
  link: string(),
})

export default doctorDetailsSchema;