import { Request, Response } from 'express';
import { ValidationError } from 'yup';
import doctorSchema from './schemas/doctorSchema';
import doctorModel from '../models/doctorModel';
import results from '../utilities/results';
import helperFunctions from '../utilities/helperFunctions';
import addressModel from '../models/addressModel';
import doctorAdapter from '../dataAdapters/doctorAdapter';
import reservationModel from '../models/reservationModel';
import reviewModel from '../models/reviewModel';
import personModel from '../models/personModel';
import updateUtils from '../utilities/updateUtils';
import doctorLanguageModel from '../models/doctorLanguageModel';
import openingHoursModel from '../models/openingHoursModel';

const locations = async (req: Request, res: Response) => {
  const cities = await addressModel.getDoctorsCities();

  return results.success(res, cities.map((location) => location.city), 200);

};

const list = async (req: Request, res: Response) => {
  try {
    const data = await doctorSchema.searching.validate(req.query);
    const doctors = await doctorModel.getDoctors(data.surname, data.specialization, data.location);

    if (!doctors) return results.error(res, 'Person was not found', 404);
    return results.success(res, doctorAdapter.list(doctors), 200);

  } catch (e) {
    if (e instanceof ValidationError || e instanceof Error) return results.error(res, e.message, 400);
    return results.error(res, 'Unknown error', 500);
  }
};

const slots = async (req: Request, res: Response) => {
  const doctor = await doctorModel.getDoctorIdFromUserId(parseInt(req.params.id));
  if (!doctor || !doctor.doctor) return results.error(res, 'Wrong id', 404);
  const doctorId = doctor.doctor.id;

  const date = new Date(req.params.date);
  const reservationHours = await reservationModel.getReservationHours(doctorId, date);

  const where = {
    doctorId: doctorId,
    fromTime: {
      gte: date,
      lt: new Date(date.getDate() + 1),
    }
  };
  const reservations = await reservationModel.getReservations(where);

  if (reservationHours.length === 0) return results.error(res, 'Reservation hours were not found', 404);

  if (!reservationHours[0].toTime || !reservationHours[0].fromTime) return results.success(res, { slots: [] }, 200);

  const dateFrom = new Date(date);
  dateFrom.setHours(reservationHours[0].fromTime.getHours());
  dateFrom.setMinutes(reservationHours[0].fromTime.getMinutes());
  const allTimeSlots = [];
  const time = reservationHours[0].toTime.getTime() - reservationHours[0].fromTime.getTime();
  const lastTime = new Date(dateFrom);
  for (let i = 0; i < (((time / 60) / reservationHours[0].interval) / 1000); i++) {
    // regex split by second :
    const timeString = helperFunctions.convertTimeToString(new Date(lastTime));
    allTimeSlots.push(timeString);
    lastTime.setMinutes(lastTime.getMinutes() + reservationHours[0].interval);
  }

  const reservationsTimes = reservations.map((item: { fromTime: any; }) => helperFunctions.convertTimeToString(item.fromTime));
  const timeSlots = allTimeSlots.filter(function (el) {
    return !reservationsTimes.includes(el);
  });

  return results.success(res, { slots: timeSlots }, 200);
};

const postReview = async (req: Request, res: Response) => {
  try {
    const doctor = await doctorModel.getDoctorIdFromUserId(parseInt(req.params.id));
    if (!doctor || !doctor.doctor) return results.error(res, 'Wrong id', 404);
    const data = await doctorSchema.review.validate(req.body);

    const reference = await reviewModel.create(doctor.doctor.id, data);
    if (!reference) return results.error(res, 'Unknown error', 500);

    return results.success(res, { id: reference.id }, 201);

  } catch (e) {
    if (e instanceof ValidationError || e instanceof Error) return results.error(res, e.message, 400);
    return results.error(res, 'Unknown error', 500);
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    await doctorModel.removeDoctor(res.locals.jwt.doctor.id);
    await personModel.remove(res.locals.jwt.id);
    return results.success(res, {}, 200);
  } catch (e) {
    if (e instanceof Error) return results.error(res, e.message, 400);
    return results.error(res, 'Unknown error', 500);
  }
};

const infoUpdate = async (req: Request, res: Response) => {
  try {
    const data = await doctorSchema.update.validate(req.body);

    const expr = (data.oldPassword || data.password1 || data.password2);
    const hash = expr ? await updateUtils.checkPasswords(res, data) : res.locals.jwt.password;

    const updatedPerson = await personModel.updateDoctor(res.locals.jwt.id, data, hash);

    if (!updatedPerson) return results.error(res, 'Person was not found', 400);

    return results.success(res, updatedPerson.id, 200);

  } catch (e) {
    if (e instanceof ValidationError || e instanceof Error) return results.error(res, e.message, 400);
    return results.error(res, 'Unknown error', 500);
  }
};

const detail = async (req: Request, res: Response) => {

  const person = await doctorModel.getDoctorFromUserId(parseInt(req.params.id));
  return info(req, res, person, false);
};

const allInfo = async (req: Request, res: Response) => {
  const person = res.locals.jwt;
  return info(req, res, person, true);
};

const info = (req: Request, res: Response, person: any, all: boolean) => {
  if (!person || !person.doctor) return results.error(res, 'Person was not found', 404);

  const reviews = doctorAdapter.formatReviews(person.doctor.references, all);
  const reviewsRatesSum = person.doctor.references.reduce((a: number, b: any) => a + b.rate, 0);

  const opening = new Array<String>(7);
  person.doctor.openingHours.slice()
    .reverse()
    .forEach((x: any) => opening[x.day] = x.opening);

  const data = all ? doctorAdapter.allInfo(person, opening, reviewsRatesSum, reviews) : doctorAdapter.formatDetail(person, opening, reviewsRatesSum, reviews);
  return results.success(res, data, 200);
};

const detailUpdate = async (req: Request, res: Response) => {
  try {
    const data = await doctorSchema.details.validate(req.body);
    const updatedDoctor = await doctorModel.update(res.locals.jwt.doctor.id, data);
    if (!updatedDoctor) return results.error(res, 'Doctor was not found', 404);

    if (data.languages) {
      for (let language of data.languages) {
        if (language) await doctorLanguageModel.upsert(res.locals.jwt.doctor.id, language);
      }
    }

    if (data.openingHours) {
      let day = 0;
      for (let hour of data.openingHours) {
        await openingHoursModel.upsert(res.locals.jwt.doctor.id, day, hour);
        day++;
      }
    }
    return results.success(res, updatedDoctor.id, 200);

  } catch (e) {
    if (e instanceof ValidationError || e instanceof Error) return results.error(res, e.message, 400);
    return results.error(res, 'Unknown error', 500);
  }
};

export default {
  locations,
  list,
  detail,
  remove,
  detailUpdate,
  slots,
  postReview,
  infoUpdate,
  allInfo
};
