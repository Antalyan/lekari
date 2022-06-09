import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'yup';
import prisma from '../client';
import { loginSchema, personRegistrationSchema } from './schemas/personSchema';
import getPerson from '../models/personModel';
import config from '../config/config';
import hashing from '../utilities/hashing';
import results from '../utilities/results';
import doctorRegistrationSchema from './schemas/doctorSchema';

const jwt = require('jsonwebtoken');

const register = async (req: Request, res: Response) => {
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
    const data = await personRegistrationSchema.validate(req.body);
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
          }
        },
        password: hash
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

const registerDoctor = async (req: Request, res: Response) => {
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

const loginError = (res: Response) => {
  return res.status(400)
    .json({
      status: 'error',
      data: {},
      message: 'Bad credentials',
    });
};

const login = async (req: Request, res: Response) => {
  try {
    const data = await loginSchema.validate(req.body);

    const person = await getPerson({ email: data.email });
    if (!person) return loginError(res);

    const validPassword = await hashing.verify(data.password, person.password);
    if (!validPassword) return loginError(res);

    const accessToken = jwt.sign({
      id: person.id,
      email: person.email,
    }, config.server.token.secret, { expiresIn: config.server.token.expiration });

    return res.status(200)
      .json({
        message: 'Auth Successful',
        user: {
          id: person.id,
          firstName: person.firstname,
          surname: person.surname,
          token: accessToken,
          isDoctor: (person.doctor !== null && !person.doctor.deleted)
        }
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

const logout = async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    jwt.sign(authHeader, '', { expiresIn: 1 }, (_logout: any, err: any) => {
      if (!err) {
        res.send({
          status: 'success',
          message: 'You have been Logged Out'
        });
      } else {
        res.send({
          status: 'error',
          message: 'Error'
        });
      }
    });
  }
};

const validateTokenError = (res: Response, code: number, message: string) => {
  return res.status(code)
    .json({
      message: message,
    });
};

const validateToken = (req: Request, res: Response, next: NextFunction, doctor: boolean = false) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return validateTokenError(res, 401, 'Unauthorized');

  jwt.verify(token, config.server.token.secret, async (err: any, user: any) => {
    if (err) return validateTokenError(res, 403, 'Forbidden');
    const person = await getPerson({
      email: user.email,
      id: user.id
    });
    if (!person || (doctor && !person.doctor)) return validateTokenError(res, 401, 'Forbidden');
    res.locals.jwt = person;
    next();
  });
};

const validateTokenDoctor = (req: Request, res: Response, next: NextFunction) => {
  return validateToken(req, res, next, true);
};

export default {
  register,
  login,
  logout,
  validateToken,
  validateTokenDoctor,
  registerDoctor
};
