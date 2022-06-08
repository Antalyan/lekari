import { Request, Response } from 'express';
import prisma from '../client';
import results from '../utilities/results';
import doctorModel from '../models/doctorModel';
import reservationSchema from './schemas/reservationSchema';
import { getTimeInMinutes } from './helperFunctions';
import { ValidationError } from 'yup';

export const personReservations = async (req: Request, res: Response) => {
  const date = new Date();
  const reservations = await prisma.person.findMany({
    where: {
      email: res.locals.jwt.email,
      deleted: false
    },
    select: {
      reservations: {
        where: {
          fromTime: {
            gte: date,
          }
        },
        orderBy: {
          fromTime: 'asc'
        },
        select: {
          id: true,
          doctor: {
            select: {
              person: {
                select: {
                  firstname: true,
                  surname: true,
                  degree: true,
                }
              },
              address: {
                select: {
                  city: true,
                  street: true,
                  buildingNumber: true,
                }
              },
              specialization: true,
              email: true,
            }
          },
          fromTime: true,
          toTime: true,
          personComment: true,
          created: true
        }
      }
    }
  });

  if (!reservations || reservations.length == 0) {
    return res.status(404)
      .send({
        status: 'error',
        data: {},
        message: 'Person was not found'
      });
  }

  let data = (reservations[0]).reservations.map(
    function (reservation) {
      return {
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
      };
    }
  );

  return res.send({
    status: 'success',
    data: { reservations: data }
  });
};

export const doctorReservations = async (req: Request, res: Response) => {
  const reservations = await prisma.reservation.findMany({
    where: {
      doctorId: res.locals.jwt.doctor.id,
      fromTime: {
        gte: new Date(),
      }
    },
    orderBy: {
      fromTime: 'asc'
    },
    include: {
      person: true,
      personTmp: true,
    }
  });

  if (!reservations || reservations.length == 0) return results.error(res, 'Doctor was not found', 404);

  let data = reservations.map(function (reservation) {
    if (reservation.person) {
      return {
        id: reservation.person.id,
        personDegree: reservation.person.degree,
        personFirstname: reservation.person.firstname,
        personSurname: reservation.person.surname,
        visitTimeFrom: reservation.fromTime.toLocaleTimeString(),
        visitTimeTo: reservation.toTime.toLocaleTimeString(),
        visitDate: reservation.fromTime.toISOString()
          .split('T')[0],
        note: reservation.personComment,
        createTime: reservation.created.toLocaleTimeString(),
        createDate: reservation.created.toISOString()
          .split('T')[0],
      };
    } else if (reservation.personTmp) {
      return {
        id: reservation.personTmp.id,
        personDegree: reservation.personTmp.degree,
        personFirstname: reservation.personTmp.firstname,
        personSurname: reservation.personTmp.surname,
        visitTimeFrom: reservation.fromTime.toLocaleTimeString(),
        visitTimeTo: reservation.toTime.toLocaleTimeString(),
        visitDate: reservation.fromTime.getDate(),
        note: reservation.personComment,
        createTime: reservation.created.toLocaleTimeString(),
        createDate: reservation.created.toUTCString(),
      };
    }
  });

  return res.send({
    status: 'success',
    data: { reservations: data },
  });
};

const createReservationRegistered = async (req: Request, res: Response) => {
  try {
    const personId = parseInt(req.params.id);
    const doctor = await doctorModel.getDoctorIdFromUserId(personId);
    if (!doctor || !doctor.doctor) {
      return res.sendStatus(400);
    }
    const doctorId = doctor.doctor.id;
    const data = await reservationSchema.validate(req.body);
    const day = new Date(data.date).getDay();
    const today = new Date();
    const reservationHours = await prisma.reservationHours.findFirst({
      where: {
        doctorId: doctorId,
        day: day,
        fromDate: {
          lte: today
        }
      },
      select: {
        fromTime: true,
        toTime: true,
        interval: true,
      }
    });

    if (!reservationHours) return results.error(res, 'Can\'t make reservation for this day.', 500);

    // parseInt parameter 10 for remove leading zeros
    let hours = parseInt(data.time.split(':')[0], 10);
    let minutes = parseInt(data.time.split(':')[1], 10);
    if (!reservationHours.fromTime || !reservationHours.toTime) {
      return results.error(res, 'Time is out of reservation hours.', 500);
    }
    let reservationHoursFrom = getTimeInMinutes(reservationHours.fromTime);
    let reservationHoursTo = getTimeInMinutes(reservationHours.toTime);
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

    const person = await prisma.person.findFirst({
      where: {
        email: res.locals.jwt.email,
      }
    });

    if (person) {
      const reservation = await prisma.reservation.create({
        data: {
          doctor: { connect: { id: doctorId } },
          person: { connect: { id: person.id } },
          fromTime: fromTime,
          toTime: toTime,
          personComment: data.comment,
        }
      });
      if (reservation) {
        return res.status(201)
          .send({
            status: 'success',
            data: { id: fromTime },
            message: 'Reservation saved.'
          });
      } else {
        return results.error(res, 'Unknown error.', 500);
      }
    }
  } catch (e) {
    if (e instanceof ValidationError || e instanceof Error) return results.error(res, e.message, 400);
    return results.error(res, 'Unknown error', 500);
  }
};

export default {
  personReservations,
  doctorReservations,
  createReservationRegistered,
};
