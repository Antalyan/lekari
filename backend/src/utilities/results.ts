import { Response } from 'express';

const error = (res: Response, message: string, code: number) => {
  return res.status(code)
    .json({
      status: 'error',
      message: message,
    });
};

export default { error };
