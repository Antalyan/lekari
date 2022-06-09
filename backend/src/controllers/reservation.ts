import { Request, Response } from 'express';
import prisma from '../client';
import results from '../utilities/results';
import doctorModel from '../models/doctorModel';
import reservationSchema from './schemas/reservationSchema';
import { convertTimeToString, createDatetime, getTimeInMinutes } from './helperFunctions';
import { ValidationError } from 'yup';
import personTmpSchema from './schemas/personTmpSchema';
import reservationHoursSchema from './schemas/reservationHoursSchema';

export const person = async (req: Request, res: Response) => {
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

export const doctor = async (req: Request, res: Response) => {
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

const createRegistered = async (req: Request, res: Response) => {
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

const createNotRegistered = async (req: Request, res: Response) => {
  try {
    const personId = parseInt(req.params.id);
    const doctor = await doctorModel.getDoctorIdFromUserId(personId);
    if (!doctor || !doctor.doctor) {
      return res.sendStatus(400);
    }
    const doctorId = doctor.doctor.id;
    const data = await personTmpSchema.validate(req.body);
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

    let reservation: any;
    if (data.country && data.city && data.postalCode && data.buildingNumber) {
      reservation = await prisma.reservation.create({
        data: {
          doctor: { connect: { id: doctorId } },
          personTmp: {
            create: {
              firstname: data.firstname,
              surname: data.surname,
              degree: data.degree || null,
              birthdate: data.birthdate,
              email: data.email || null,
              insuranceNumber: data.insuranceNumber || null,
              phonePrefix: data.phonePrefix,
              phone: data.phone,
              address: {
                create: {
                  country: data.country,
                  city: data.city,
                  street: data.street || null,
                  postalCode: data.postalCode,
                  buildingNumber: data.buildingNumber,
                }
              }
            }
          },
          fromTime: fromTime,
          toTime: toTime,
          personComment: data.comment,
        }
      });
    } else {
      reservation = await prisma.reservation.create({
        data: {
          doctor: { connect: { id: doctorId } },
          personTmp: {
            create: {
              firstname: data.firstname,
              surname: data.surname,
              degree: data.degree || null,
              birthdate: data.birthdate,
              email: data.email || null,
              insuranceNumber: data.insuranceNumber || null,
              phonePrefix: data.phonePrefix,
              phone: data.phone
            }
          },
          fromTime: fromTime,
          toTime: toTime,
          personComment: data.comment,
        }
      });
    }
    if (reservation) {
      return res.status(201)
        .send({
          status: 'success',
          data: { id: reservation.id },
          message: 'Reservation saved.'
        });
    } else {
      return results.error(res, 'Unknown error.', 500);
    }

  } catch (e) {
    if (e instanceof ValidationError || e instanceof Error) return results.error(res, e.message, 400);
    return results.error(res, 'Unknown error', 500);
  }
};

const hoursGet = async (req: Request, res: Response) => {
  const today = new Date();
  const reservationHours = await prisma.reservationHours.findMany({
    orderBy: [
      {
        fromDate: 'asc',
      },
      {
        day: 'asc',
      },
    ],
    where: {
      doctor: {
        person: {
          email: res.locals.jwt.username
        },
        deleted: false,
      },
      fromDate: {
        lte: today
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

  let hours = Array<any>(7);

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
        fromTime: convertTimeToString(value.fromTime),
        toTime: convertTimeToString(value.toTime)
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
    const data = await reservationHoursSchema.validate(req.body);

    const doctor = await doctorModel.getDoctorFromUserEmail(res.locals.jwt.username);
    if (!doctor) return results.error(res, 'Doctor was not found', 500);

    if (data.slots) {
      let preproccesed = data.slots.map(function (value, index) {
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
            fromTime: createDatetime(data.fromDate, value.fromTime),
            toTime: createDatetime(data.fromDate, value.toTime)
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
        let resTimeFrom = getTimeInMinutes(reservation.fromTime);
        let resHourTimeFrom = getTimeInMinutes(reservationChange.fromTime);
        let resTimeTo = getTimeInMinutes(reservation.toTime);
        let resHourTimeTo = getTimeInMinutes(reservationChange.toTime);
        if (!resHourTimeFrom || !resHourTimeTo || !resTimeFrom || !resTimeTo) {
          return results.error(res, 'V konfliktu s existujícími rezervacemi.', 409);
        }
        if (resTimeFrom < resHourTimeFrom || resTimeTo > resHourTimeTo) {
          return results.error(res, 'V konfliktu s existujícími rezervacemi.', 409);
        }
      }

      let result = [];

      for (const value of preproccesed) {
        try {
          let created = await prisma.reservationHours.create({
            data: value
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
  const deleted = prisma.reservation.deleteMany({
    where: {
      id: req.body.id,
      doctorId: res.locals.jwt.doctor.id,
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
  doctorRemove
};
