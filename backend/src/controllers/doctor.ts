import { Request, Response } from 'express';
import prisma from '../client';
import { number, object, string, ValidationError } from 'yup';
import { doctorRegistrationSchema, doctorUpdateSchema } from './schemas/doctorSchema';
import doctorModel from '../models/doctorModel';
import doctorDetailsSchema from './schemas/doctorDetailsSchema';
import results from '../utilities/results';
import { convertTimeToString } from './helperFunctions';
import hashing from '../utilities/hashing';

const locations = async (req: Request, res: Response) => {
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

  return results.success(res, cities.map((location) => location.city), 200);

};

const detail = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const person = await doctorModel.getDoctorFromUserId(id);

  if (!person || !person.doctor) return results.error(res, 'Person was not found', 404);

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

  let opening = new Array<String | null>(7);
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

const list = async (req: Request, res: Response) => {
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

  if (!doctors) return results.error(res, 'Person was not found', 404);

  return res.send({
    status: 'success',
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

  if (reservationHours.length === 0) return results.error(res, 'Reservation hours were not found', 404);

  if (reservationHours[0].fromTime && reservationHours[0].toTime) {
    let dateFrom = new Date(date);
    dateFrom.setHours(reservationHours[0].fromTime.getHours());
    dateFrom.setMinutes(reservationHours[0].fromTime.getMinutes());
    let allTimeSlots = [];
    let time = reservationHours[0].toTime.getTime() - reservationHours[0].fromTime.getTime();
    let lastTime = new Date(dateFrom);
    for (let i = 0; i < (((time / 60) / reservationHours[0].interval) / 1000); i++) {
      // regex split by second :
      let timeString = convertTimeToString(new Date(lastTime));
      allTimeSlots.push(timeString);
      lastTime.setMinutes(lastTime.getMinutes() + reservationHours[0].interval);
    }

    const reservationsTimes = reservations.map((item: { fromTime: any; }) => convertTimeToString(item.fromTime));
    let timeSlots = allTimeSlots.filter(function (el) {
      return !reservationsTimes.includes(el);
    });

    return res.send({
      status: 'success',
      data: { slots: timeSlots }
    });
  }
  return res.send({
    status: 'success',
    data: { slots: [] }
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
      return results.error(res, 'Unknown error', 500);
    }

  } catch (e) {
    if (e instanceof ValidationError || e instanceof Error) return results.error(res, e.message, 400);
    return results.error(res, 'Unknown error', 500);
  }
};

const signUp = async (req: Request, res: Response) => {
  let {
    password1,
    password2
  } = req.body;

  if (password1 !== password2) return results.error(res, 'Password doesn\'t match the controll.', 400);

  try {
    const data = await doctorRegistrationSchema.validate(req.body);
    const hash = await hashing.hash(password1);
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
      return results.error(res, 'Unknown error', 500);
    }

  } catch (e) {
    if (e instanceof ValidationError || e instanceof Error) return results.error(res, e.message, 400);
    return results.error(res, 'Unknown error', 500);
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    await prisma.doctor.updateMany({
      where: {
        person: {
          email: res.locals.jwt.email
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
    if (e instanceof Error) return results.error(res, e.message, 500);
    return results.error(res, 'Unknown error', 500);
  }
};

const infoUpdate = async (req: Request, res: Response) => {
  try {
    const data = await doctorUpdateSchema.validate(req.body);
    let updatedPerson = null;

    if (data.oldPassword && data.password1 && data.password2) {
      const person = res.locals.jwt;
      if (!person) return results.error(res, 'Can\'t find person.', 400);

      const validPassword = await hashing.verify(data.oldPassword, person.password);
      if (!validPassword) return results.error(res, 'Old password is not valid.', 400);

      if (data.password1 !== data.password2) return results.error(res, 'Passwords don\'t match.', 400);

      const hash = await hashing.hash(data.password1);

      updatedPerson = await prisma.person.update({
        where: {
          email: res.locals.jwt.email,
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
          email: res.locals.jwt.email,
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

    if (!updatedPerson) return results.error(res, 'Person was not found', 400);

    return res.send({
      status: 'success',
      data: updatedPerson.id
    });

  } catch (e) {
    if (e instanceof ValidationError || e instanceof Error) return results.error(res, e.message, 400);
    return results.error(res, 'Unknown error', 500);
  }
};

const doctorInfoAll = async (req: Request, res: Response) => {
  const person = res.locals.jwt;

  if (!person || !person.doctor) return results.error(res, 'Person was not found', 404);

  let reviews = person.doctor.references.map((review: any) => {
    return {
      rate: review.rate / 2,
      comment: review.comment,
      author: review.author,
      creatDate: review.created.toUTCString(),
      createTime: review.created.toLocaleTimeString()
    };
  });

  const reviewsRatesSum = person.doctor.references.reduce((a: number, b: any) => a + b.rate, 0);

  const opening = new Array<String>(7);
  person.doctor.openingHours.slice()
    .reverse()
    .forEach(function (x: any) {
      opening[x.day] = x.opening;
    });

  return res.status(200)
    .json({
      status: 'success',
      data: {
        degree: person.degree,
        firstname: person.firstname,
        surname: person.surname,
        birthdate: person.birthdate,
        email: person.email,
        phonePrefix: person.phonePrefix,
        phone: person.phone,
        insuranceNumber: person.insuranceNumber,
        specialization: person.doctor.specialization,
        country: person.address.country,
        city: person.address.city,
        postalCode: person.address.postalCode,
        street: person.address.street,
        buildingNumber: person.address.buildingNumber,

        workEmail: person.doctor.email,
        workPhone: person.doctor.phone,
        description: person.doctor.description,
        link: person.doctor.link,
        languages: person.doctor.languages.map((language: { language: string }) => {
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
        rateAverage: reviewsRatesSum / person.doctor.references.length,
        reviews: reviews,
        reservationHours: person.doctor.reservationHours,
      }
    });
};

const detailUpdate = async (req: Request, res: Response) => {
  try {
    const data = await doctorDetailsSchema.validate(req.body);
    const doctor = await doctorModel.getDoctorFromUserEmail(res.locals.jwt.username);
    if (!doctor) return results.error(res, 'Doctor was not found', 404);
    const updatedDoctor = await prisma.doctor.update({
      where: {
        id: doctor.id
      },
      data: {
        email: data.email || null,
        phone: data.phone || null,
        description: data.description || null,
        link: data.link || null,
      }
    });
    if (!updatedDoctor) return results.error(res, 'Doctor was not found', 404);
    if (data.languages) {
      for (let language of data.languages) {
        if (language) {
          await prisma.doctorLanguage.upsert({
            where: {
              doctorId_language: {
                doctorId: doctor.id,
                language: language
              }
            },
            update: {},
            create: {
              doctor: {
                connect: {
                  id: doctor.id
                }
              },
              language: language
            }
          });
        }
      }
    }
    let day = 0;
    if (data.openingHours) {
      for (let hour of data.openingHours) {
        await prisma.openingHours.upsert({
          where: {
            doctorId_day: {
              doctorId: doctor.id,
              day: day
            }
          },
          update: {
            opening: hour
          },
          create: {
            doctor: {
              connect: {
                id: doctor.id,
              }
            },
            day: day,
            opening: hour
          }
        });
        day++;
      }
    }
    return res.send({
      status: 'success',
      data: updatedDoctor.id
    });

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
  doctorSlots,
  postReview,
  signUp,
  infoUpdate,
  doctorInfoAll
};
