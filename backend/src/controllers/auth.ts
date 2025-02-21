import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'yup';
import personSchema from './schemas/personSchema';
import personModel from '../models/personModel';
import config from '../config/config';
import hashing from '../utilities/hashing';
import results from '../utilities/results';
import doctorSchema from './schemas/doctorSchema';
import authAdapter from '../dataAdapters/authAdapter';

const jwt = require('jsonwebtoken');

const register = async (req: Request, res: Response) => {
  const {
    password1,
    password2
  } = await personSchema.password.validate(req.body);

  if (password1 !== password2) return results.error(res, 'Password doesn\'t match the controll.', 400);

  try {
    const data = await personSchema.registration.validate(req.body);
    const person = await personModel.create(data, await hashing.hash(password1));
    if (!person) results.error(res, 'Unable to create person', 400);

    return results.success(res, { id: person.id }, 201);

  } catch (e) {
    if (e instanceof ValidationError || e instanceof Error) return results.error(res, e.message, 400);
    return results.error(res, 'Unknown error', 500);
  }
};

const registerDoctor = async (req: Request, res: Response) => {
  const {
    password1,
    password2
  } = await personSchema.password.validate(req.body);

  if (password1 !== password2) return results.error(res, 'Password doesn\'t match the controll.', 400);

  try {
    const data = await doctorSchema.registration.validate(req.body);
    const person = await personModel.createDoctor(data, await hashing.hash(password1));
    if (!person) results.error(res, 'Unable to create person', 400);

    return results.success(res, { id: person.id }, 201);

  } catch (e) {
    if (e instanceof ValidationError || e instanceof Error) return results.error(res, e.message, 400);
    return results.error(res, 'Unknown error', 500);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const data = await personSchema.login.validate(req.body);

    const person = await personModel.getPerson({ email: data.email });
    if (!person) return results.error(res, 'Bad credentials', 400);

    const validPassword = await hashing.verify(data.password, person.password);
    if (!validPassword) return results.error(res, 'Bad credentials', 400);

    const accessToken = jwt.sign(authAdapter.token(person), config.server.token.secret,
      { expiresIn: config.server.token.expiration });
    return results.success(res, authAdapter.logged(person, accessToken), 200);

  } catch (e) {
    if (e instanceof ValidationError || e instanceof Error) return results.error(res, e.message, 400);
    return results.error(res, 'Unknown error', 500);
  }

};

const logout = async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return results.error(res, 'Unauthorized', 401);

  const accessToken = jwt.sign(authAdapter.token(res.locals.jwt), config.server.token.secret,
    { expiresIn: '1s' });

  return results.success(res, { token: accessToken }, 200);
};

const validateToken = (req: Request, res: Response, next: NextFunction, doctor: boolean = false) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return results.error(res, 'Unauthorized', 401);

  jwt.verify(token, config.server.token.secret, async (err: any, user: any) => {
    if (err) return results.error(res, 'Forbidden', 403);
    const person = await personModel.getPerson({
      email: user.email,
      id: user.id
    });
    if (!person || (doctor && !person.doctor)) return results.error(res, 'Forbidden', 401);
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
