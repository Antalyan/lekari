import { number, object, string } from 'yup';

const registrationSchema = object({
  date: string()
    .required(),
  time: string()
    .required(),
  comment: string()
});

export default registrationSchema;
