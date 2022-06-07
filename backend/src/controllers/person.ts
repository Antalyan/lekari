import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'yup';
import prisma from '../client';
import { personRegistrationSchema, personUpdateSchema } from './schemas/personSchema';
import registrationSchema from './schemas/reservationSchema';
import getPerson from '../models/personModel';

const bcryptjs = require('bcryptjs');

const personList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const persons = await prisma.person.findMany({
      where: {
        deleted: false,
      }
    });
    res.json(persons);
  } catch (error) {
    next(error);
  }
};

const personDetail = async (req: Request, res: Response) => {
  const person = await prisma.person.findMany({
    where: {
      email: res.locals.jwt.username,
    },
    select: {
      firstname: true,
      surname: true,
      degree: true,
      email: true,
      phone: true,
      phonePrefix: true,
      birthdate: true,
      insuranceNumber: true,
      address: {
        select: {
          country: true,
          city: true,
          postalCode: true,
          street: true,
        }
      },
      deleted: true,
    }
  });

  if (!person || person[0].deleted) {
    return res.status(404)
      .send({
        status: 'error',
        data: {},
        message: 'Person was not found'
      });
  }

  return res.send({
    status: 'sucess',
    data: person[0],
  });
};

const passwordError = (res: Response, message: String) => {
  return res.status(400)
    .json({
      status: 'error',
      data: {},
      message: message,
    });
};

const personUpdate = async (req: Request, res: Response) => {
  try {
    const data = await personUpdateSchema.validate(req.body);
    let updatedPerson = null

    if(data.oldPassword && data.newPassword1 && data.newPassword2){
      const person = await getPerson({ email: res.locals.jwt.username });
      if (!person) return passwordError(res, "Can't find person.");

      const validPassword = await bcryptjs.compare(data.oldPassword, person.password);
      if (!validPassword) return passwordError(res, "Old password is not valid.");

      if (data.newPassword1 !== data.newPassword2) return passwordError(res, "Passwords don't match.");

      const hash = await bcryptjs.hash(data.newPassword1, 10);

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
          insuranceNumber: data.insuranceNumber,
          address:{
            update: {
              country: data.country,
              city: data.city,
              postalCode: data.postalCode,
              street: data.street || null,
              buildingNumber: data.buildingNumber,
            }
          },
          password: hash
        }
      });
    } else{
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
          insuranceNumber: data.insuranceNumber,
          address:{
            update: {
              country: data.country,
              city: data.city,
              postalCode: data.postalCode,
              street: data.street || null,
              buildingNumber: data.buildingNumber,
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
      data: updatedPerson
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

const personReservations = async (req: Request, res: Response) => {
  const date = new Date();
  const reservations = await prisma.person.findMany({
    where: {
      email: res.locals.jwt.username,
      deleted: false
    },
    select: {
      reservations: {
        where:{
          fromTime: {
            gte: date,
          }
        },
        orderBy: {
          fromTime: "asc"
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
              address:{
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
    function(reservation, index){
      return {
        id: reservation.id,
        doctorDegree: reservation.doctor.person.degree,
        doctorFirstname: reservation.doctor.person.firstname,
        doctorSurname: reservation.doctor.person.surname,
        visitTimeFrom: reservation.fromTime.toLocaleTimeString(),
        visitTimeTo: reservation.toTime.toLocaleTimeString(),
        visitDate: reservation.fromTime.toISOString().split('T')[0],
        note: reservation.personComment,
        createTime: reservation.created.toLocaleTimeString(),
        createDate: reservation.created.toISOString().split('T')[0],
        workStreet:  reservation.doctor.address.street,
        workBuildingNumber: reservation.doctor.address.buildingNumber,
        workCity: reservation.doctor.address.city,
      }
    }
  )

  return res.send({
    status: 'sucess',
    data: {reservations: data}
  });
};

const personDelete = async (req: Request, res: Response) => {
  try {
    await prisma.person.updateMany({
      where: {
        email: res.locals.jwt.username
      },
      data: {
        deleted: true,
      }
    });
    return res.status(200)
      .send({
        status: 'success',
        message: 'Person deleted.',
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

export default {
  personList,
  personDetail,
  personDelete,
  personUpdate,
  personReservations
};
