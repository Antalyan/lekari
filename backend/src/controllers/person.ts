import { NextFunction, Request, Response } from 'express';
import { date, number, object, string, ValidationError } from 'yup';
import prisma from '../client';

const personList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const persons = await prisma.person.findMany({});
    res.json(persons);
  } catch (error) {
    next(error);
  }
};

const personSchema = object({
  firstname: string()
    .required(),
  surname: string()
    .required(),
  degree: string(),
  birthdate: date()
    .required(),
  email: string()
    .required(),
  phonePrefix: string()
    .required(),
  phone: number()
    .required(),
  insuranceNumber: number(),
  country: string()
    .required(),
  city: string()
    .required(),
  postalCode: number()
    .required(),
  street: string(),
  buildingNumber: string()
    .required(),
  password1: string()
    .required(),
});

const personDetail = async (req: Request, res: Response) => {
  const person = await prisma.person.findMany({
    where: {
      email: res.locals.jwt.username
    },
    select: {
      firstname: true,
      surname: true,
      degree: true,
      email: true,
      phone: true,
      insuranceNumber: true,
      address: {
        select: {
          country: true,
          city: true,
          postalCode: true,
          street: true,
        }
      }
    }
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
    data: person[0],
  });
};

const personUpdate = async (req: Request, res: Response) => {
  try {
    const data = await personSchema.validate(req.body);
    const person = await prisma.person.updateMany({
      where: {
        email: res.locals.jwt.username
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
      email: res.locals.jwt.username
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

export default {
  personList,
  personDetail,
  personUpdate,
  personReservations
};
