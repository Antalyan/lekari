import { Response } from 'express';

const error = (res: Response, message: string, code: number) => {
  return res.status(code)
    .json({
      status: 'error',
      message: message,
    });
};

const success = (res: Response, data: any, code: number) => {
  return res.status(code)
    .send({
      status: 'success',
      data: data,
    });
};

export default {
  error,
  success
};
