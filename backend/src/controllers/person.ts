import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'yup';
import prisma from '../client';
import { personUpdateSchema } from './schemas/personSchema';

const bcryptjs = require('bcryptjs');

const list = async (req: Request, res: Response, next: NextFunction) => {
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

const detail = async (req: Request, res: Response) => {
  const person = await prisma.person.findFirst({
    where: {
      email: res.locals.jwt.email,
      deleted: false,
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
          buildingNumber: true,
        }
      },
      deleted: true,
    }
  });

  if (!person || person.deleted) {
    return res.status(404)
      .send({
        status: 'error',
        data: {},
        message: 'Person was not found'
      });
  }

  return res.send({
    status: 'success',
    data: {
      firstname: person.firstname,
      surname: person.surname,
      degree: person.degree || null,
      email: person.email,
      phone: person.phone,
      phonePrefix: person.phonePrefix,
      birthdate: person.birthdate,
      insuranceNumber: person.insuranceNumber || null,
      country: person.address.country,
      city: person.address.city,
      postalCode: person.address.postalCode,
      street: person.address.street || null,
      buildingNumber: person.address.buildingNumber,
    }
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

const update = async (req: Request, res: Response) => {
  try {
    const data = await personUpdateSchema.validate(req.body);
    let updatedPerson = null;

    if (data.oldPassword && data.password1 && data.password2) {
      const person = res.locals.jwt;
      if (!person) return passwordError(res, 'Can\'t find person.');

      const validPassword = await bcryptjs.compare(data.oldPassword, person.password);
      if (!validPassword) return passwordError(res, 'Old password is not valid.');

      if (data.password1 !== data.password2) return passwordError(res, 'Passwords don\'t match.');

      const hash = await bcryptjs.hash(data.password1, 10);

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
      status: 'success',
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

const remove = async (req: Request, res: Response) => {
  try {
    await prisma.person.updateMany({
      where: {
        email: res.locals.jwt.email
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
  list,
  detail,
  remove,
  update,
};
