import { Request, Response } from 'express';
import prisma from '../client';
import { number, object, string, ValidationError } from 'yup';
import { doctorRegistrationSchema, doctorUpdateSchema } from './schemas/doctorSchema';
import personTmpSchema from './schemas/personTmpSchema';
import reservationSchema from './schemas/reservationSchema';
import doctorModel from '../models/doctorModel';
import getPerson from '../models/personModel';

const bcryptjs = require('bcryptjs');

const locationList = async (req: Request, res: Response) => {
  const cities = await prisma.address.findMany({
    where: {
      NOT: {
        doctor: null,
      }
    },
    distinct: ['city'],
    select: {
      city: true,
    }
  });

  return res.status(200)
    .send({
      status: 'success',
      data: cities.map((location) => location.city),
    });

};

const doctorDetail = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const person = await doctorModel.getDoctorFromUserId(id);

  if (!person || !person.doctor) {
    return res.status(404)
      .send({
        status: 'error',
        data: {},
        message: 'Person was not found'
      });
  }

  let reviews = person.doctor.references.map(function (review) {
    return {
      rate: review.rate / 2,
      comment: review.comment,
      author: review.author,
      createDate: review.created.toISOString()
        .split('T')[0],
      createTime: review.created.toLocaleTimeString()
    };
  });

  let reviewsRatesSum = person.doctor.references.reduce((a, b) => a + (b.rate / 2), 0);

  let opening = new Array<String>(7);
  person.doctor.openingHours.slice()
    .reverse()
    .forEach(function (x) {
      opening[x.day] = x.opening;
    });

  return res.status(200)
    .json({
      status: 'success',
      data: {
        degree: person.degree,
        firstname: person.firstname,
        surname: person.surname,
        specialization: person.doctor.specialization,
        workEmail: person.doctor.email,
        workPhone: person.doctor.phone,
        description: person.doctor.description,
        link: person.doctor.link,
        languages: person.doctor.languages.map(language => {
          return language.language;
        }),
        workCountry: person.doctor.address.country,
        workCity: person.doctor.address.city,
        workPostalCode: person.doctor.address.postalCode,
        workStreet: person.doctor.address.street,
        workBuildingNumber: person.doctor.address.buildingNumber,
        profilePicture: person.doctor.profilePicture,
        actuality: person.doctor.actuality,
        openingHours: opening,
        rateAverage: Math.round((reviewsRatesSum / person.doctor.references.length) * 2) / 2,
        reviews: reviews
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
    orderBy: [{
      specialization: 'asc',
    }, {
      person: {
        surname: 'asc',
      }
    },],
    where: {
      person: {
        surname: {
          contains: surname as string || undefined
        },
        deleted: false,
      },
      specialization: {
        contains: specialization as string || undefined
      },
      address: {
        city: {
          contains: location as string || undefined
        },
      },
      deleted: false,
    },
    select: {
      person: {
        select: {
          id: true,
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
        id: doctor.person.id,
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

const doctorReservations = async (req: Request, res: Response) => {
  const date = new Date();
  const reservations = await prisma.doctor.findMany({
    where: {
      person: {
        email: res.locals.jwt.username
      }
    },
    select: {
      reservations: {
        orderBy: {
          fromTime: 'asc'
        },
        where: {
          fromTime: {
            gte: date,
          }
        },
        select: {
          person: {
            select: {
              id: true,
              firstname: true,
              surname: true,
              degree: true,
              email: true,
              phone: true
            }
          },
          personTmp: {
            select: {
              id: true,
              firstname: true,
              surname: true,
              degree: true,
              email: true,
              phone: true
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
        message: 'Doctor was not found'
      });
  }

  let data = (reservations[0]).reservations.map(function (reservation) {
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
    status: 'sucess',
    data: { reservations: data },
  });
};

const convertTimeToString = (datetime: Date) => {
  if(datetime){
    let splitTime = datetime.toTimeString().match(/([0-9]+:[0-9]+)/g);
    if(splitTime){
      return splitTime[0]
    }
  }
  return null
}

const doctorSlots = async (req: Request, res: Response) => {
  const personId = parseInt(req.params.id);
  const doctor = await doctorModel.getDoctorIdFromUserId(personId);
  if (!doctor || !doctor.doctor) {
    return res.sendStatus(400);
  }
  const doctorId = doctor.doctor.id;
  const date = new Date(req.params.date);
  const nextDay = new Date();
  nextDay.setDate(date.getDate() + 1);
  const day = date.getDay();
  let today = new Date();

  const reservationHours = await prisma.reservationHours.findMany({
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
      fromDate: true,
      interval: true
    }
  });

  const reservations = await prisma.reservation.findMany({
    where: {
      doctorId: doctorId,
      fromTime: {
        gte: date,
        lt: nextDay,
      }
    },
    select: {
      fromTime: true
    }
  });

  if (reservationHours.length === 0) {
    return res.status(404)
      .send({
        status: 'error',
        data: {},
        message: 'Reservation hours were not found'
      });
  }
  let dateFrom = new Date(date);
  dateFrom.setHours(reservationHours[0].fromTime.getHours());
  dateFrom.setMinutes(reservationHours[0].fromTime.getMinutes());
  let allTimeSlots = [];
  let time = reservationHours[0].toTime.getTime() - reservationHours[0].fromTime.getTime();
  let lastTime = new Date(dateFrom);
  for (let i = 0; i < (((time / 60) / reservationHours[0].interval) / 1000); i++) {
    // regex split by second :
    let timeString = convertTimeToString(new Date(lastTime))
    allTimeSlots.push(timeString);
    lastTime.setMinutes(lastTime.getMinutes() + reservationHours[0].interval);
  }

  const reservationsTimes = reservations.map((item: { fromTime: any; }) => convertTimeToString(item.fromTime));
  let timeSlots = allTimeSlots.filter(function (el) {
    return !reservationsTimes.includes(el);
  });

  return res.send({
    status: 'sucess',
    data: { slots: timeSlots }
  });
};

const reviewSchema = object({
  author: string(),
  rate: number()
    .min(0)
    .max(5)
    .required(),
  comment: string()
});

const postReview = async (req: Request, res: Response) => {
  try {
    const personId = parseInt(req.params.id);
    const doctor = await doctorModel.getDoctorIdFromUserId(personId);
    if (!doctor || !doctor.doctor) {
      return res.sendStatus(400);
    }
    const doctorId = doctor.doctor.id;
    const data = await reviewSchema.validate(req.body);
    const reference = await prisma.review.create({
      data: {
        doctorId: doctorId,
        comment: data.comment,
        rate: data.rate * 2,
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
    const data = await doctorRegistrationSchema.validate(req.body);
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

const doctorDelete = async (req: Request, res: Response) => {
  try {
    await prisma.doctor.updateMany({
      where: {
        person: {
          email: res.locals.jwt.username
        }
      },
      data: {
        deleted: true,
      }
    });
    return res.status(200)
      .send({
        status: 'success',
        message: 'Doctor deleted.',
      });
  } catch (e) {
    if (e instanceof Error) {
      return res.status(400)
        .send({
          status: 'error',
          message: e.message
        });
    }
  }
};

const createReservationNonregistered = async (req: Request, res: Response) => {
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

    if (!reservationHours) {
      return res.status(500)
        .send({
          status: 'error',
          message: 'Can\'t make reservation for this day.',
        });
    }
    
   // parseInt parameter 10 for remove leading zeros
   let hours = parseInt(data.time.split(':')[0], 10);
   let minutes = parseInt(data.time.split(':')[1], 10);
   let reservationHoursFrom = reservationHours.fromTime.getHours() * 60 + reservationHours.fromTime.getMinutes();
   let reservationHoursTo = reservationHours.toTime.getHours() * 60 + reservationHours.toTime.getMinutes();
   if ((hours * 60 + minutes) < reservationHoursFrom ||
     (hours * 60 + minutes + reservationHours.interval) > reservationHoursTo) {
     return res.status(500)
       .send({
         status: 'error',
         message: 'Time is out of reservation hours.',
       });
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

    if (checkFree.length !== 0) {
      return res.status(500)
        .send({
          status: 'error',
          message: 'Someone already ordered.',
        });
    }

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

    if (!reservationHours) {
      return res.status(500)
        .send({
          status: 'error',
          message: 'Can\'t make reservation for this day.',
        });
    }
    // parseInt parameter 10 for remove leading zeros
    let hours = parseInt(data.time.split(':')[0], 10);
    let minutes = parseInt(data.time.split(':')[1], 10);
    let reservationHoursFrom = reservationHours.fromTime.getHours() * 60 + reservationHours.fromTime.getMinutes();
    let reservationHoursTo = reservationHours.toTime.getHours() * 60 + reservationHours.toTime.getMinutes();
    if ((hours * 60 + minutes) < reservationHoursFrom ||
      (hours * 60 + minutes + reservationHours.interval) > reservationHoursTo) {
      return res.status(500)
        .send({
          status: 'error',
          message: 'Time is out of reservation hours.',
        });
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

    if (checkFree.length !== 0) {
      return res.status(500)
        .send({
          status: 'error',
          message: 'Someone already ordered.',
        });
    }

    const person = await prisma.person.findFirst({
      where: {
        email: res.locals.jwt.username,
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
        return res.status(500)
          .send({
            status: 'error',
            message: '',
          });
      }
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

const passwordError = (res: Response, message: String) => {
  return res.status(400)
    .json({
      status: 'error',
      data: {},
      message: message,
    });
};

const infoUpdate = async (req: Request, res: Response) => {
  try {
    const data = await doctorUpdateSchema.validate(req.body);
    let updatedPerson = null;

    if (data.oldPassword && data.password1 && data.password2) {
      const person = await getPerson({ email: res.locals.jwt.username });
      if (!person) return passwordError(res, 'Can\'t find person.');

      const validPassword = await bcryptjs.compare(data.oldPassword, person.password);
      if (!validPassword) return passwordError(res, 'Old password is not valid.');

      if (data.password1 !== data.password2) return passwordError(res, 'Passwords don\'t match.');

      const hash = await bcryptjs.hash(data.password1, 10);

      updatedPerson = await prisma.person.update({
        where: {
          email: res.locals.jwt.username,
        },
        data: {
          firstname: data.firstname,
          surname: data.surname,
          degree: data.degree || null,
          birthdate: data.birthdate,
          email: data.email,
          phonePrefix: data.phonePrefix,
          phone: data.phone,
          insuranceNumber: data.insuranceNumber || null,
          address: {
            update: {
              country: data.country,
              city: data.city,
              postalCode: data.postalCode,
              street: data.street || null,
              buildingNumber: data.buildingNumber,
            }
          },
          doctor: {
            update: {
              specialization: data.specialization,
              actuality: data.actuality || null,
              address: {
                update: {
                  country: data.workCountry,
                  city: data.workCity,
                  postalCode: data.workPostalCode,
                  street: data.workStreet || null,
                  buildingNumber: data.workBuildingNumber,
                }
              },
            }
          },
          password: hash
        }
      });
    } else {
      updatedPerson = await prisma.person.update({
        where: {
          email: res.locals.jwt.username,
        },
        data: {
          firstname: data.firstname,
          surname: data.surname,
          degree: data.degree || null,
          birthdate: data.birthdate,
          email: data.email,
          phonePrefix: data.phonePrefix,
          phone: data.phone,
          insuranceNumber: data.insuranceNumber || null,
          address: {
            update: {
              country: data.country,
              city: data.city,
              postalCode: data.postalCode,
              street: data.street || null,
              buildingNumber: data.buildingNumber,
            }
          },
          doctor: {
            update: {
              specialization: data.specialization,
              actuality: data.actuality || null,
              address: {
                update: {
                  country: data.workCountry,
                  city: data.workCity,
                  postalCode: data.workPostalCode,
                  street: data.workStreet || null,
                  buildingNumber: data.workBuildingNumber,
                }
              },
            }
          }
        }
      });
    }

    if (!updatedPerson) {
      return res.status(404)
        .send({
          status: 'error',
          data: {},
          message: 'Person was not found'
        });
    }

    return res.send({
      status: 'sucess',
      data: updatedPerson.id
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

const doctorInfoAll = async (req: Request, res: Response) => {
  const doctor = await prisma.doctor.findFirst({
    where: {
      person: {
        email: res.locals.jwt.username
      }
    },
    include: {
      person: true,
      languages: true,
      address: true,
      openingHours: true,
      references: true,
      reservationHours: {
        orderBy: [
          {
            day: 'asc',
          },
        ],
        distinct: ['day']
      }
    }
  });

  if (!doctor || doctor.person.deleted || doctor.deleted) {
    return res.status(404)
      .send({
        status: 'error',
        data: {},
        message: 'Person was not found'
      });
  }

  let reviews = doctor.references.map(function (review) {
    return {
      rate: review.rate / 2,
      comment: review.comment,
      author: review.author,
      creatDate: review.created.toUTCString(),
      createTime: review.created.toLocaleTimeString()
    };
  });

  let reviewsRatesSum = doctor.references.reduce((a, b) => a + b.rate, 0);

  let opening = new Array<String>(7);
  doctor.openingHours.slice()
    .reverse()
    .forEach(function (x) {
      opening[x.day] = x.opening;
    });

  return res.status(200)
    .json({
      status: 'success',
      data: {
        degree: doctor.person.degree,
        firstname: doctor.person.firstname,
        surname: doctor.person.surname,
        birthdate: doctor.person.birthdate,
        email: doctor.person.email,
        phonePrefix: doctor.person.phonePrefix,
        phone: doctor.person.phone,
        insuranceNumber: doctor.person.insuranceNumber,
        specialization: doctor.specialization,
        workEmail: doctor.email,
        workPhone: doctor.phone,
        description: doctor.description,
        link: doctor.link,
        languages: doctor.languages.map(language => {
          return language.language;
        }),
        country: doctor.address.country,
        city: doctor.address.city,
        postalCode: doctor.address.postalCode,
        street: doctor.address.street,
        buildingNumber: doctor.address.buildingNumber,
        workCountry: doctor.address.country,
        workCity: doctor.address.city,
        workPostalCode: doctor.address.postalCode,
        workStreet: doctor.address.street,
        workBuildingNumber: doctor.address.buildingNumber,
        profilePicture: doctor.profilePicture,
        actuality: doctor.actuality,
        openingHours: opening,
        rateAverage: reviewsRatesSum / doctor.references.length,
        reviews: reviews,
        reservationHours: doctor.reservationHours,
      }
    });
};

export default {
  locationList,
  doctorList,
  doctorDetail,
  doctorDelete,
  doctorReservations,
  doctorSlots,
  postReview,
  signUp,
  createReservationRegistered,
  createReservationNonregistered,
  infoUpdate,
  doctorInfoAll
};
