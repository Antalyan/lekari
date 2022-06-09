import { array, date, number, object, string } from 'yup';

const registration = object({
  date: string()
    .required(),
  time: string()
    .required(),
  comment: string()
});

const timeRangeSchema = object({
  fromTime: string()
    .nullable(),
  toTime: string()
    .nullable()
});

const reservationHoursSchema = object({
  fromDate: date()
    .required(),
  interval: number()
    .integer(),
  slots: array()
    .required()
    .of(
      object()
        .shape(
          timeRangeSchema.nullable().fields)
    )
});

export default {
  registration,
  reservationHoursSchema
};
