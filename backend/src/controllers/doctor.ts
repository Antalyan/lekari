import { Request, Response } from 'express';
import prisma from '../client';
import { number, object, string, ValidationError } from 'yup';
import personSchema from './schemas/personSchema';

const bcryptjs = require('bcryptjs');

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
          buildingNumber: true,
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

  return res.status(200)
    .json({
      status: 'success',
      data: {
        degree: doctor.person.degree,
        firstname: doctor.person.firstname,
        surname: doctor.person.surname,
        specialization: doctor.specialization,
        workEmail: doctor.email,
        workPhone: doctor.phone,
        description: doctor.description,
        link: doctor.link,
        languages: doctor.languages.map(language => {
          return language.language;
        }),
        workCountry: doctor.address.country,
        workCity: doctor.address.city,
        workPostalCode: doctor.address.postalCode,
        workStreet: doctor.address.street,
        workBuildingNumber: doctor.address.buildingNumber,
        profilePicture: doctor.profilePicture,
        actuality: doctor.actuality,
        reservationHours: doctor.openingHours,
        references: doctor.references
      }
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
          degree: true,
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
    data: doctors.map(doctor => {
      return {
        id: doctor.id,
        degree: doctor.person.degree,
        firstname: doctor.person.firstname,
        surname: doctor.person.surname,
        specialization: doctor.specialization,
        city: doctor.address.city,
        actuality: doctor.actuality
      };
    })
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

const reviewSchema = object({
  author: string(),
  rate: number()
    .min(1)
    .max(10)
    .integer()
    .required(),
  comment: string()
    .required()
});

const postReview = async (req: Request, res: Response) => {
  try {
    const doc_id = parseInt(req.params.id);
    const data = await reviewSchema.validate(req.body);
    const reference = await prisma.review.create({
      data: {
        doctorId: doc_id,
        comment: data.comment,
        rate: data.rate,
        author: data.author || null
      }
    });
    if (reference) {
      return res.status(201)
        .send({
          status: 'success',
          data: { id: reference.id },
          message: 'Review saved.'
        });
    } else {
      return res.status(500)
        .send({
          status: 'error',
          message: '',
        });
    }
  } catch (e) {
    if (e instanceof ValidationError) {
      return res.status(400)
        .send({
          status: 'error',
          data: e.errors,
          message: e.message
        });
    }
    if (e instanceof Error) {
      return res.status(500)
        .send({
          status: 'error',
          data: e.message,
          message: 'Something went wrong'
        });
    }
  }
};

const regDoctorSchema = personSchema.shape({
  specialization: string()
    .required(),
  actuality: string(),
  workCountry: string()
    .required(),
  workCity: string()
    .required(),
  workPostalCode: number()
    .required(),
  workStreet: string(),
  workBuildingNumber: string()
    .required(),
});

const signUp = async (req: Request, res: Response) => {
  let {
    password1,
    password2
  } = req.body;

  if (password1 !== password2) {
    return res.status(400)
      .send({
        status: 'error',
        data: {},
        message: 'Password doesn\'t match the controll.'
      });
  }
  try {
    const data = await regDoctorSchema.validate(req.body);
    const hash = await bcryptjs.hash(password1, 10);
    const person = await prisma.person.create({
      data: {
        firstname: data.firstname,
        surname: data.surname,
        degree: data.degree || null,
        birthdate: data.birthdate,
        email: data.email,
        insuranceNumber: data.insuranceNumber || null,
        phonePrefix: data.phonePrefix,
        phone: data.phone,
        address: {
          create: {
            country: data.country,
            city: data.city,
            postalCode: data.postalCode,
            street: data.street || null,
            buildingNumber: data.buildingNumber,
          },
        },
        password: hash,
        doctor: {
          create: {
            specialization: data.specialization,
            actuality: data.actuality || null,
            address: {
              create: {
                country: data.country,
                city: data.city,
                postalCode: data.postalCode,
                street: data.street || null,
                buildingNumber: data.buildingNumber,
              }
            }
          }
        }
      }
    });
    if (person) {
      return res.status(201)
        .send({
          status: 'success',
          data: { id: person.id },
          message: 'Person registered.'
        });
    } else {
      return res.status(500)
        .send({
          status: 'error',
          message: '',
        });
    }
  } catch (e) {
    if (e instanceof ValidationError) {
      return res.status(400)
        .send({
          status: 'error',
          data: e.errors,
          message: e.message
        });
    }
    if (e instanceof Error) {
      return res.status(500)
        .send({
          status: 'error',
          data: e.message,
          message: 'Something went wrong'
        });
    }
  }
};

export default {
  doctorList,
  doctorDetail,
  doctorUpdate,
  doctorReservations,
  doctorSlots,
  postReview,
  signUp,
  createReservation: notImplemented,
  postComment: notImplemented,
  infoUpdate: notImplemented
};
