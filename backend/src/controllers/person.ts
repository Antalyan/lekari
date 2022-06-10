import { Request, Response } from 'express';
import personSchema from './schemas/personSchema';
import results from '../utilities/results';
import personModel from '../models/personModel';
import updateUtils from '../utilities/updateUtils';
import personAdapter from '../dataAdapters/personAdapter';

const detail = async (req: Request, res: Response) => {

  const person = res.locals.jwt;
  if (!person || person.deleted) return results.error(res, 'Person was not found.', 404);

  return results.success(res, personAdapter.detail(person), 200);
};

const update = async (req: Request, res: Response) => {
  try {
    const data = await personSchema.update.validate(req.body);

    const expr = (data.oldPassword || data.password1 || data.password2);
    const hash = expr ? await updateUtils.checkPasswords(res, data) : res.locals.jwt.password;

    const updatedPerson = await personModel.update(res.locals.jwt.id, data, hash);
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
  detail,
  remove,
  update,
};
