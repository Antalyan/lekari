import { date, number, object, string } from 'yup';

export const reservationHoursSchema = object({
    fromDate: date().required(),
    interval: number().integer().min(0).max(4).required(),
    timeFrom0: number().integer(),
    timeFrom1: number().integer(),
    timeFrom2: number().integer(),
    timeFrom3: number().integer(),
    timeFrom4: number().integer(),
    timeFrom5: number().integer(),
    timeFrom6: number().integer(),
    timeTo0: number().integer(),
    timeTo1: number().integer(),
    timeTo2: number().integer(),
    timeTo3: number().integer(),
    timeTo4: number().integer(),
    timeTo5: number().integer(),
    timeTo6: number().integer(),
    toDate: date().required(),
  });

export default reservationHoursSchema;
