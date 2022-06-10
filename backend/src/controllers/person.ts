import { NextFunction, Request, Response } from 'express';
import prisma from '../client';
import personSchema from './schemas/personSchema';
import results from '../utilities/results';
import personModel from '../models/personModel';
import updateUtils from '../utilities/updateUtils';

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

const update = async (req: Request, res: Response) => {
  try {
    const data = await personSchema.update.validate(req.body);

    const expr = (data.oldPassword || data.password1 || data.password2);
    const hash = expr ? await updateUtils.checkPasswords(res, data) : res.locals.jwt.password;

    const updatedPerson = await prisma.person.update({
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

    if (!updatedPerson) return results.error(res, 'Person was not found.', 404);

    return results.success(res, updatedPerson.id, 200);

  } catch (e) {
    if (e instanceof Error) return results.error(res, e.message, 400);
    return results.error(res, 'Unknown error', 500);
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    await personModel.remove(res.locals.jwt.id);
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
