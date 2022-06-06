import { number, object, string } from 'yup';

const registrationSchema = object({
  date: string()
    .required(),
  slotIndex: number()
    .required(),
  comment: string()
});

export default registrationSchema;
