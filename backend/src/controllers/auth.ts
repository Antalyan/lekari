import { Request, Response } from 'express';
import signJWT from '../functions/signJWT';
import bcryptjs from 'bcryptjs';
import { date, number, object, string, ValidationError } from 'yup';
import jwt from 'jsonwebtoken';

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const validateToken = (req: Request, res: Response) => {
  return res.status(200)
    .json({
      status: 'success',
      message: 'Token(s) validated'
    });
};

const personSchema = object({
  firstname: string()
    .required(),
  surename: string()
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
    const data = await personSchema.validate(req.body);
    const hash = await bcryptjs.hash(password1, 10);
    const person = await prisma.person.create({
      data: {
        firstname: data.firstname,
        surename: data.surename,
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

const login = async (req: Request, res: Response) => {
  let {
    email,
    password
  } = req.body;

  const person = await prisma.person.findMany({
    where: {
      email: email
    }
  });
  if (person) {
    bcryptjs.compare(password, person[0].password, (error, result) => {
      if (error) {
        return res.status(401)
          .json({
            status: 'error',
            data: {},
            message: 'Password Mismatch'
          });
      } else if (result) {
        signJWT(person[0], (_error, token) => {
          if (_error) {
            return res.status(401)
              .json({
                message: 'Unable to Sign JWT',
                error: _error
              });
          } else if (token) {
            return res.status(200)
              .json({
                message: 'Auth Successful',
                token,
                user: person[0]
              });
          }
        });
      } else {
        return res.status(600)
          .json({
            status: 'error',
            data: {},
            message: 'Bad password',
          });
      }
    });
  } else {
    return res.status(404)
      .json({
        status: 'error',
        data: {},
        message: 'User not found',
      });
  }
};

const logout = async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    jwt.sign(authHeader, '', { expiresIn: 1 }, (logout, err) => {
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
  validateToken,
  register,
  login,
  logout
};
