import { Request, Response } from 'express';
import prisma from '../client';
import { object, string, ValidationError } from 'yup';

const doctorDetail = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const doctor = await prisma.doctor.findUnique({
    where: {
      id: id
    },
    select: {
      person: {
        select: {
          firstname: true,
          surname: true,
          degree: true,
        }
      },
      specialization: true,
      email: true,
      phone: true,
      description: true,
      link: true,
      languages: {
        select: {
          language: true
        }
      },
      address: {
        select: {
          country: true,
          city: true,
          postalCode: true,
          street: true,
        }
      },
      profilePicture: true,
      actuality: true,
      openingHours: {
        select: {
          day: true,
          fromTime: true,
          toTime: true,
          fromDate: true,
        }
      },
      references: {
        select: {
          rate: true,
          comment: true,
          author: true,
          created: true,
        }
      }
    }
  });

  if (!doctor) {
    return res.status(404)
      .send({
        status: 'error',
        data: {},
        message: 'Person was not found'
      });
  }

  return res.send({
    status: 'success',
    data: doctor
  });
};

const doctorList = async (req: Request, res: Response) => {
  const {
    surname,
    location,
    specialization
  } = req.query;

  const doctors = await prisma.doctor.findMany({
    where: {
      person: {
        surname: {
          contains: surname as string || undefined
        },
      },
      specialization: {
        contains: specialization as string || undefined
      },
      address: {
        city: {
          contains: location as string || undefined
        },
      }
    },
    select: {
      id: true,
      person: {
        select: {
          firstname: true,
          surname: true,
        }
      },
      specialization: true,
      address: {
        select: {
          city: true,
        }
      },
      actuality: true,
    },
  });

  if (!doctors) {
    return res.status(404)
      .send({
        status: 'error',
        data: {},
        message: 'Person was not found'
      });
  }

  return res.send({
    status: 'sucess',
    data: doctors
  });
};

const doctorSchema = object({
  specialization: string()
    .matches(/(chirirg|psychytr|ortoped)/),
  actuality: string(),
  email: string(),
  phone: string(),
  description: string(),
  link: string(),
  profilePicture: string()
});

const doctorUpdate = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const data = await doctorSchema.validate(req.body);
    const doctor = await prisma.doctor.updateMany({
      where: {
        id: id
      },
      data: data
    });

    if (!doctor) {
      return res.status(404)
        .send({
          status: 'error',
          data: {},
          message: 'Person was not found'
        });
    }

    return res.send({
      status: 'sucess',
      data: doctor
    });
  } catch (e) {
    if (e instanceof ValidationError) {
      return res.status(400)
        .send({
          status: 'error',
          data: e.errors,
          message: e.message
        });
    }
  }
};

const doctorReservations = async (req: Request, res: Response) => {
  const reservations = await prisma.doctor.findMany({
    where: {
      person: {
        email: res.locals.jwt.username
      }
    },
    select: {
      reservations: {
        select: {
          person: {
            select: {
              firstname: true,
              surname: true,
              degree: true,
              email: true,
              phone: true
            }
          },
          from: true,
          personComment: true,
          created: true
        }
      }
    }
  });

  if (!reservations) {
    return res.status(404)
      .send({
        status: 'error',
        data: {},
        message: 'Person was not found'
      });
  }

  return res.send({
    status: 'sucess',
    data: reservations[0],
  });
};

const doctorSlots = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const date = new Date(req.params.date);
  const tomorrow = new Date();
  tomorrow.setDate(date.getDate() + 1);
  const weekday = new Array(7);
  weekday[0] = 'Monday';
  weekday[1] = 'Tuesday';
  weekday[2] = 'Wednesday';
  weekday[3] = 'Thursday';
  weekday[4] = 'Friday';
  weekday[5] = 'Saturday';
  weekday[6] = 'Sunday';
  const day = weekday[date.getDay()];

  const openingHours = await prisma.reservationHours.findMany({
    where: {
      doctorId: id,
      day: day,
    },
    select: {
      fromTime: true,
      toTime: true,
      fromDate: true,
      interval: true
    }
  });

  const reservations = await prisma.reservation.findMany({
    where: {
      doctorId: id,
      from: {
        gte: date,
        lt: tomorrow,
      }
    },
    select: {
      from: true
    }
  });

  if (openingHours.length === 0) {
    return res.status(404)
      .send({
        status: 'error',
        data: {},
        message: 'Opening hours was not found'
      });
  }
  let dateFrom = new Date(date);
  dateFrom.setTime(openingHours[0].fromTime.getTime());
  let allTimeSlots = [];
  let time = openingHours[0].toTime.getTime() - openingHours[0].fromTime.getTime();
  let lastTime = new Date(dateFrom);
  for (let i = 0; i < (((time / 60) / openingHours[0].interval) / 1000); i++) {
    allTimeSlots.push(new Date(lastTime));
    lastTime.setMinutes(lastTime.getMinutes() + 30);
  }

  const reservationsTimes = reservations.map((item: { from: any; }) => item.from.toLocaleString());
  let timeSlots = allTimeSlots.filter(function (el) {
    return !reservationsTimes.includes(el.toLocaleString());
  });

  return res.send({
    status: 'sucess',
    data: timeSlots
  });
};

const notImplemented = async (req: Request, res: Response) => {
  return res.status(501)
    .send({
      status: 'error',
      message: 'Not implemented yet',
    });
};

export default {
  doctorList,
  doctorDetail,
  doctorUpdate,
  doctorReservations,
  doctorSlots,
  signUp: notImplemented
};
