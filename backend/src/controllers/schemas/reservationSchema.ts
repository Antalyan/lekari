import { date, number, object, string } from 'yup';

const registrationSchema = object({
  date: string().required(),
  interval: number().required(),
  slotIndex: number().required(),
  comment: string()
});

export default registrationSchema;