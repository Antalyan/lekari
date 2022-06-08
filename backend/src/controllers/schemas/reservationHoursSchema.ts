import { date, number, object, array, string } from 'yup';

const timeRangeSchema = object({
  fromTime: string().nullable(),
  toTime: string().nullable()
})

export const reservationHoursSchema = object({
    fromDate: date().required(),
    interval: number().integer(),
    slots: array().required().of(
      object().shape(
        timeRangeSchema.nullable().fields)
    )
  });

export default reservationHoursSchema;
