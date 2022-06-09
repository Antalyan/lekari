import { NextFunction, Request, Response } from 'express';
import prisma from '../client';
import { personUpdateSchema } from './schemas/personSchema';
import results from '../utilities/results';

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

  if (!person || person.deleted) return results.error(res, 'Person was not found.', 404);

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

const passwordError = (res: Response, message: string) => {
  return results.error(res, message, 400);
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

    if (!updatedPerson) return results.error(res, 'Person was not found.', 404);

    return results.success(res, updatedPerson.id, 200);

  } catch (e) {
    if (e instanceof Error) return results.error(res, e.message, 400);
    return results.error(res, 'Unknown error', 500);
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
    return results.success(res, {}, 200);
  } catch (e) {
    if (e instanceof Error) return results.error(res, e.message, 400);
    return results.error(res, 'Unknown error', 500);
  }
};

export default {
  list,
  detail,
  remove,
  update,
};
