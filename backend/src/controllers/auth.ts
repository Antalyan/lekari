import { Request, Response } from 'express';
import { ValidationError } from 'yup';
import prisma from '../client';
import { loginSchema, personRegistrationSchema } from './schemas/personSchema';
import getPerson from '../models/personModel';
import config from '../config/config';

const bcryptjs = require('bcryptjs');
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

    const validPassword = await bcryptjs.compare(data.password, person.password);
    if (!validPassword) return loginError(res);

    const accessToken = jwt.sign({
      id: person.id,
      email: person.email,
    }, config.server.token.secret);

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

export default {
  register,
  login,
  logout
};
