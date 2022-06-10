import { Request, Response } from 'express';
import prisma from '../client';
import results from '../utilities/results';
import doctorModel from '../models/doctorModel';
import reservationSchema from './schemas/reservationSchema';
import helperFunctions from '../utilities/helperFunctions';
import { ValidationError } from 'yup';
import personSchema from './schemas/personSchema';
import reservationModel from '../models/reservationModel';
import { Person, PersonTmp } from '@prisma/client';

const person = async (req: Request, res: Response) => {
  const reservations = await reservationModel.getReservations({
    personId: res.locals.jwt.id,
    fromTime: {
      gte: new Date(),
    },
  });

  if (!reservations) {
    return res.status(404)
      .send({
        status: 'error',
        data: {},
        message: 'Person was not found'
      });
  }

  let data = reservations.map(
    reservation => ({
      id: reservation.id,
      doctorDegree: reservation.doctor.person.degree,
      doctorFirstname: reservation.doctor.person.firstname,
      doctorSurname: reservation.doctor.person.surname,
      visitTimeFrom: reservation.fromTime.toLocaleTimeString(),
      visitTimeTo: reservation.toTime.toLocaleTimeString(),
      visitDate: reservation.fromTime.toISOString()
        .split('T')[0],
      note: reservation.personComment,
      createTime: reservation.created.toLocaleTimeString(),
      createDate: reservation.created.toISOString()
        .split('T')[0],
      workStreet: reservation.doctor.address.street,
      workBuildingNumber: reservation.doctor.address.buildingNumber,
      workCity: reservation.doctor.address.city,
    })
  );

  return res.send({
    status: 'success',
    data: { reservations: data }
  });
};

const doctor = async (req: Request, res: Response) => {
  const reservations = await reservationModel.getReservations({
    doctorId: res.locals.jwt.doctor.id,
    fromTime: {
      gte: new Date(),
    }
  });

  if (!reservations) return results.error(res, 'Doctor was not found', 404);

  let data = reservations.map(function (reservation) {

    const person: Person | PersonTmp | null = reservation.person || reservation.personTmp;
    if (!person) return;
    return {
      id: reservation.id,
      personDegree: person.degree,
      personFirstname: person.firstname,
      personSurname: person.surname,
      visitTimeFrom: reservation.fromTime.toLocaleTimeString(),
      visitTimeTo: reservation.toTime.toLocaleTimeString(),
      visitDate: reservation.fromTime.toISOString()
        .split('T')[0],
      note: reservation.personComment,
      createTime: reservation.created.toLocaleTimeString(),
      createDate: reservation.created.toISOString()
        .split('T')[0],
    };
  });

  return res.send({
    status: 'success',
    data: { reservations: data },
  });
};

const create = async (req: Request, res: Response, tmp: boolean) => {
  const doctor = await doctorModel.getDoctorFromUserId(parseInt(req.params.id));
  if (!doctor || !doctor.doctor) return results.error(res, 'Cannot find doctor.', 400);
  const doctorId = doctor.doctor.id;

  const data = (!tmp) ? await reservationSchema.registration.validate(req.body) : await personSchema.tmp.validate(req.body);

  const day = new Date(data.date).getDay();
  const reservationHours = await prisma.reservationHours.findFirst({
    where: {
      doctorId: doctorId,
      day: day,
      fromDate: {
        lte: new Date(data.date)
      }
    },
    orderBy: {
      fromDate: 'desc'
    },
  });

  if (!reservationHours) return results.error(res, 'Can\'t make reservation for this day.', 500);

  // parseInt parameter 10 for remove leading zeros

  const hours = parseInt(data.time.split(':')[0], 10);
  const minutes = parseInt(data.time.split(':')[1], 10);

  if (!reservationHours.fromTime || !reservationHours.toTime) return results.error(res, 'Time is out of reservation hours.', 500);

  let reservationHoursFrom = helperFunctions.getTimeInMinutes(reservationHours.fromTime);
  let reservationHoursTo = helperFunctions.getTimeInMinutes(reservationHours.toTime);
  if (!reservationHoursFrom || !reservationHoursTo ||
    (hours * 60 + minutes) < reservationHoursFrom ||
    (hours * 60 + minutes + reservationHours.interval) > reservationHoursTo) {
    return results.error(res, 'Time is out of reservation hours.', 500);
  }

  let fromTime = new Date(data.date);
  fromTime.setHours(hours);
  fromTime.setMinutes(minutes);
  let toTime = new Date(fromTime);
  toTime.setMinutes(fromTime.getMinutes() + reservationHours.interval);

  const checkFree = await prisma.reservation.findMany({
    where: {
      doctorId: doctorId,
      fromTime: fromTime
    },
  });

  if (checkFree.length !== 0) return results.error(res, 'Someone already ordered.', 500);

  const reservation = tmp ? await reservationModel.createReservationNotRegistered(doctorId, fromTime, toTime, data) : await reservationModel.createReservation(doctorId, res.locals.jwt.id, fromTime, toTime, data.comment);

  if (!reservation) return results.error(res, 'Unknown error.', 500);
  return results.success(res, { id: fromTime }, 201);

};

const createRegistered = async (req: Request, res: Response) => {
  try {
    return await create(req, res, false);
  } catch (e) {
    if (e instanceof ValidationError || e instanceof Error) return results.error(res, e.message, 400);
    return results.error(res, 'Unknown error', 500);
  }
};

const createNotRegistered = async (req: Request, res: Response) => {
  try {
    return await create(req, res, true);
  } catch (e) {
    if (e instanceof ValidationError || e instanceof Error) return results.error(res, e.message, 400);
    return results.error(res, 'Unknown error', 500);
  }
};

const hoursGet = async (req: Request, res: Response) => {
  let date = new Date();
  try {
    date = new Date(req.params.date);
  } catch (e) {
    results.error(res, 'Query param is not in valid date format.', 500);
  }

  const reservationHours = await prisma.reservationHours.findMany({
    orderBy: [
      {
        fromDate: 'desc',
      },
      {
        day: 'asc',
      },
    ],
    where: {
      doctor: {
        person: {
          email: res.locals.jwt.email,
        },
        deleted: false,
      },
      fromDate: {
        lte: date
      }
    },
    select: {
      fromDate: true,
      day: true,
      fromTime: true,
      toTime: true,
      interval: true,
    },
    distinct: ['day'],
  });

  let hours = Array<any>(7)
    .fill({
      fromTime: null,
      toTime: null
    });

  if (reservationHours.length === 0) {
    return res.status(200)
      .json({
        status: 'success',
        data: {
          fromDate: null,
          interval: null,
          slots: hours
        }
      });
  }

  reservationHours.forEach(function (value) {
    if (!value.fromTime || !value.toTime) {
      hours[value.day] = {
        fromTime: null,
        toTime: null
      };
    } else {
      hours[value.day] = {
        fromTime: helperFunctions.convertTimeToString(value.fromTime),
        toTime: helperFunctions.convertTimeToString(value.toTime)
      };
    }
  });

  return res.status(200)
    .json({
      status: 'success',
      data: {
        fromDate: reservationHours[0].fromDate,
        interval: reservationHours[0].interval,
        slots: hours
      }
    });
};

const hoursPost = async (req: Request, res: Response) => {
  try {
    const data = await reservationSchema.hours.validate(req.body);

    const doctor = res.locals.jwt.doctor;

    console.log(doctor);

    if (data.slots) {
      let preproccesed = data.slots.map((value: any, index: number) => {
        if (value.fromTime && value.toTime) {
          return {
            doctor: {
              connect: {
                id: doctor.id
              }
            },
            day: index,
            fromDate: data.fromDate,
            interval: data.interval,
            fromTime: helperFunctions.createDatetime(data.fromDate, value.fromTime),
            toTime: helperFunctions.createDatetime(data.fromDate, value.toTime)
          };
        } else {
          return {
            doctor: {
              connect: {
                id: doctor.id
              }
            },
            day: index,
            fromDate: data.fromDate,
            interval: data.interval,
            fromTime: null,
            toTime: null
          };
        }
      });

      const checkReservations = await prisma.reservation.findMany({
        where: {
          doctorId: doctor.id,
          fromTime: {
            gt: data.fromDate
          }
        },
      });

      for (let reservation of checkReservations) {
        let day = reservation.fromTime.getDay();
        let reservationChange = preproccesed[day];
        let resTimeFrom = helperFunctions.getTimeInMinutes(reservation.fromTime);
        let resHourTimeFrom = helperFunctions.getTimeInMinutes(reservationChange.fromTime);
        let resTimeTo = helperFunctions.getTimeInMinutes(reservation.toTime);
        let resHourTimeTo = helperFunctions.getTimeInMinutes(reservationChange.toTime);
        if (resHourTimeFrom == 0 || resHourTimeTo == 0 || resTimeFrom == 0 || resTimeTo == 0) {
          return results.error(res, 'V konfliktu s existujícími rezervacemi.', 409);
        }
        if (resTimeFrom < resHourTimeFrom || resTimeTo > resHourTimeTo) {
          return results.error(res, 'V konfliktu s existujícími rezervacemi.', 409);
        }
      }

      let result = [];

      for (const value of preproccesed) {
        if (helperFunctions.getTimeInMinutes(value.fromTime) > helperFunctions.getTimeInMinutes(value.toTime)) {
          return results.error(res, 'Čas od je vyšší než čas do.', 400);
        }
        try {
          let created = await prisma.reservationHours.upsert({
            where: {
              doctorId_day_fromDate: {
                doctorId: doctor.id,
                day: value.day,
                fromDate: value.fromDate,
              }
            },
            update: {
              fromTime: value.fromTime,
              toTime: value.toTime,
              interval: value.interval
            },
            create: {
              doctorId: doctor.id,
              day: value.day,
              fromDate: value.fromDate,
              fromTime: value.fromTime,
              toTime: value.toTime,
              interval: value.interval
            }
          });
          result.push(created);
        } catch (e) {
          return results.error(res, 'Rezervační hodiny od tohoto data už jsou nastaveny.', 400);
        }
      }

      return res.status(200)
        .json({
          status: 'success',
          data: {
            reservationHours: result
          }
        });
    }
    return results.error(res, 'Missing attribute slots', 400);
  } catch (e) {
    if (e instanceof ValidationError || e instanceof Error) return results.error(res, e.message, 400);
    return results.error(res, 'Unknown error', 500);
  }
};

const doctorRemove = async (req: Request, res: Response) => {
  const deleted = await prisma.reservation.deleteMany({
    where: {
      id: req.body.id,
      doctorId: res.locals.jwt.doctor.id,
    }
  });

  if (!deleted) return results.error(res, 'Unable to remove reservation', 404);

  return results.success(res, deleted, 200);

};

const personRemove = async (req: Request, res: Response) => {
  const deleted = await prisma.reservation.deleteMany({
    where: {
      id: req.body.id,
      personId: res.locals.jwt.id,
    }
  });

  if (!deleted) return results.error(res, 'Unable to remove reservation', 404);

  return results.success(res, deleted, 200);

};

export default {
  person,
  doctor,
  createRegistered,
  createNotRegistered,
  hoursGet,
  hoursPost,
  doctorRemove,
  personRemove
};
