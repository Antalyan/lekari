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
        select: {
          doctor: {
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
