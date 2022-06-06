import { Request, Response } from 'express';
import prisma from '../client';
import { number, object, string, ValidationError } from 'yup';
import doctorRegistrationSchema from './schemas/doctorSchema';
import { boolean } from 'yup/lib/locale';
import personTmpSchema from './schemas/personTmpSchema';
import reservationSchema from './schemas/reservationSchema';
import IReservationHours from '../interfaces/reservationHours';

const bcryptjs = require('bcryptjs');

const locationList = async (req: Request, res: Response) => {
  const locations = await prisma.doctor.findMany({
    select: {
      address:{
        select:{
          city: true
        }
      }
    }
  })

  let locationsList = locations.map(function(location, index){
    return location.address.city
  })

  return res.status(200)
      .send({
        status: 'success',
        data: locationsList.filter((v, i, a) => a.indexOf(v) === i),
      });

}

const doctorDetail = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const doctor = await prisma.doctor.findUnique({
    where: {
      id: id,
    },
    select: {
      person: {
        select: {
          firstname: true,
          surname: true,
          degree: true,
          deleted: true,
        }
      },
      deleted: true,
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
          opening: true,
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

  if (!doctor || doctor.person.deleted || doctor.deleted) {
    return res.status(404)
      .send({
        status: 'error',
        data: {},
        message: 'Person was not found'
      });
  }

  let reviews = doctor.references.map(function(review, index){
    return {
      rate: review.rate / 2,
      comment: review.comment,
      author: review.author,
      creatDate: review.created.toISOString().split('T')[0],
      createTime: review.created.toLocaleTimeString()
    }
  })

  let reviewsRatesSum = doctor.references.reduce((a, b) => a + (b.rate / 2), 0);

  let opening =  new Array<String>(7);
  doctor.openingHours.slice().reverse().forEach(function(x) {
    opening[x.day] = x.opening;
  });

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
        openingHours: opening,
        rateAverage: Math.round((reviewsRatesSum/doctor.references.length)*2)/2,
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
    orderBy: [
      {
        specialization: 'asc',
      },
      {
        person:{
          surname: 'asc',
        }
      },
    ],
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

const doctorReservations = async (req: Request, res: Response) => {
  const date = new Date()
  const reservations = await prisma.doctor.findMany({
    where: {
      person: {
        email: res.locals.jwt.username
      }
    },
    select: {
      reservations: {
        orderBy: {
          fromTime: "asc"
        },
        where:{
          fromTime: {
            gte: date,
          }
        },
        select: {
          id: true,
          person: {
            select: {
              firstname: true,
              surname: true,
              degree: true,
              email: true,
              phone: true
            }
          },
          personTmp: {
            select:{
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

  let data = (reservations[0]).reservations.map(
    function(reservation, index){
      if(reservation.person){
        return {
          id: reservation.id,
          personDegree: reservation.person.degree,
          personFirstname: reservation.person.firstname,
          personSurname: reservation.person.surname,
          visitTimeFrom: reservation.fromTime.toLocaleTimeString(),
          visitTimeTo: reservation.toTime.toLocaleTimeString(),
          visitDate: reservation.fromTime.toISOString().split('T')[0],
          note: reservation.personComment,
          createTime: reservation.created.toLocaleTimeString(),
          createDate: reservation.created.toISOString().split('T')[0],
        }
      } else if (reservation.personTmp){
        return {
          id: reservation.id,
          personDegree: reservation.personTmp.degree,
          personFirstname: reservation.personTmp.firstname,
          personSurname: reservation.personTmp.surname,
          visitTimeFrom: reservation.fromTime.toLocaleTimeString(),
          visitTimeTo: reservation.toTime.toLocaleTimeString(),
          visitDate: reservation.fromTime.getDate(),
          note: reservation.personComment,
          createTime: reservation.created.toLocaleTimeString(),
          createDate: reservation.created.toUTCString(),
        }
      }
    }
  )

  return res.send({
    status: 'sucess',
    data: {reservations: data},
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
      fromTime: {
        gte: date,
        lt: tomorrow,
      }
    },
    select: {
      fromTime: true
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
    lastTime.setMinutes(lastTime.getMinutes() + openingHours[0].interval);
  }

  const reservationsTimes = reservations.map((item: { fromTime: any; }) => item.fromTime.toLocaleString());
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
});

const postReview = async (req: Request, res: Response) => {
  try {
    const doc_id = parseInt(req.params.id);
    const data = await reviewSchema.validate(req.body);
    const reference = await prisma.review.create({
      data: {
        doctorId: doc_id,
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

//TODO: nonvalid calculation of fromTime
const createReservationNonregistered = async (req: Request, res: Response) => {
  try {
    const doc_id: number = parseInt(req.params.id);
    const data = await personTmpSchema.validate(req.body);
    const day = new Date(data.date).getDay()
    const today = new Date()
    const reservationHours = await prisma.reservationHours.findFirst({
      where: {
        doctorId: doc_id,
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
    })

    if(!reservationHours){
      return res.status(500)
        .send({
          status: 'error',
          message: "Can't make reservation for this day.",
        });
    }
    let fromTime = new Date(data.date);
    let addTime = reservationHours.interval*data.slotIndex
    fromTime.setHours(reservationHours.fromTime.getHours() + (Math.round(addTime/60)))
    fromTime.setMinutes(reservationHours.fromTime.getMinutes()+ (addTime%60))
    let toTime = new Date(fromTime)
    toTime.setMinutes(fromTime.getMinutes() + reservationHours.interval)
    let reservation = null;

    const checkFree = await prisma.reservation.findMany({
      where: {
        doctorId: doc_id,
        fromTime: fromTime
      },
    })

    if(checkFree.length !== 0){
      return res.status(500)
        .send({
          status: 'error',
          message: "Someone already ordered.",
        });
    }

    if(data.country && data.city && data.postalCode && data.buildingNumber){
      reservation = await prisma.reservation.create({
        data: {
          doctor: { connect: { id: doc_id }},
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
                create:{
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
    } else{
      reservation = await prisma.reservation.create({
        data: {
          doctor: { connect: { id: doc_id }},
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
}


const createReservationRegistered = async (req: Request, res: Response) => {
  try {
    const doc_id: number = parseInt(req.params.id);
    const data = await reservationSchema.validate(req.body);
    const day = new Date(data.date).getDay()
    const today = new Date()
    const reservationHours = await prisma.reservationHours.findFirst({
      where: {
        doctorId: doc_id,
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
    })

    if(!reservationHours){
      return res.status(500)
        .send({
          status: 'error',
          message: "Can't make reservation for this day.",
        });
    }
    let fromTime = new Date(data.date);
    let addTime = reservationHours.interval*data.slotIndex
    fromTime.setHours(reservationHours.fromTime.getHours() + (Math.round(addTime/60)))
    fromTime.setMinutes(reservationHours.fromTime.getMinutes()+ (addTime%60))
    let toTime = new Date(fromTime)
    toTime.setMinutes(fromTime.getMinutes() + reservationHours.interval)

    const checkFree = await prisma.reservation.findMany({
      where: {
        doctorId: doc_id,
        fromTime: fromTime
      },
    })

    if(checkFree.length !== 0){
      return res.status(500)
        .send({
          status: 'error',
          message: "Someone already ordered.",
        });
    }

    const person = await prisma.person.findFirst({
      where: {
        email: res.locals.jwt.username,
      }});
    if(person){
    const reservation = await prisma.reservation.create({
      data: {
        doctor: { connect: { id: doc_id }},
        person: { connect: { id: person.id}},
        fromTime: fromTime,
        toTime: toTime,
        personComment: data.comment,
      }
    });
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
}


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
  infoUpdate: notImplemented
};
