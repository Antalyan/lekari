import { Request, Response } from 'express';
import signJWT from '../functions/signJWT';
import { ValidationError } from 'yup';
import prisma from '../client';
import personSchema from './schemas/personSchema';

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const validateToken = (req: Request, res: Response) => {
  return res.status(200)
    .json({
      status: 'success',
      message: 'Token(s) validated'
    });
};

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

const login = async (req: Request, res: Response) => {
  let {
    email,
    password
  } = req.body;

  const person = await prisma.person.findFirst({
    where: {
      email: email
    },
    include: {
      doctor: true,
    },
  });
  if (person) {
    bcryptjs.compare(password, person.password, (error: any, result: any) => {
      if (error) {
        return res.status(401)
          .json({
            status: 'error',
            data: {},
            message: 'Password Mismatch'
          });
      } else if (result) {
        signJWT(person, (_error, token) => {
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
                user: {
                  id: person.id,
                  firstName: person.firstname,
                  surname: person.surname,
                  token: token,
                  isDoctor: (person.doctor !== null)
                }
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
  validateToken,
  register,
  login,
  logout
};
