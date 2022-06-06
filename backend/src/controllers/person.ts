import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'yup';
import prisma from '../client';
import { personRegistrationSchema } from './schemas/personSchema';

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

const personUpdate = async (req: Request, res: Response) => {
  try {
    const data = await personRegistrationSchema.validate(req.body);
    const person = await prisma.person.updateMany({
      where: {
        email: res.locals.jwt.username,
        deleted: false,
      },
      data: data
    });

    if (!person) {
      return res.status(404)
        .send({
          status: 'error',
          data: {},
          message: 'Person was not found'
        });
    }

    return res.send({
      status: 'sucess',
      data: person
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
  const reservations = await prisma.person.findMany({
    where: {
      email: res.locals.jwt.username,
      deleted: false
    },
    select: {
      reservations: {
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
