import { NextFunction, Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import signJWT from '../functions/signJWT';
import IUser from '../interfaces/person';
const {PrismaClient} = require('@prisma/client');
import { object, string, number, date, ValidationError, boolean } from 'yup';

const NAMESPACE = 'User';

const prisma = new PrismaClient()

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
        message: 'Token(s) validated'
    });
};

const personSchema = object({
    firstname: string(),
    surename: string(),
    degree: string(),
    birthdate: date(),
    email: string(),
    phone: number(),
    insuranceNumber: number(),
    insuranceId: string(),
    country: string(),
    city: string(),
    postalCode: number(),
    street: string(),
    password: string(),
    profilePicture: string(),
  });

const register = async (req: Request, res: Response, next: NextFunction) => {
    let { password } = req.body;
    try {
        const data = await personSchema.validate(req.body);
        bcryptjs.hash(password, 10, (hashError, hash) => {
            if (hashError) {
                return res.status(401).json({
                    message: hashError.message,
                    error: hashError
                });
            }

            data.password;
            const person = prisma.person.create({
              data
            });
        
            return res.status(201).send({
              status: "success",
              data: person,
              message: "Person registered."
            })
        });
    } catch (e) {
            if (e instanceof ValidationError) {
              return res.status(400).send({
                status: "error",
                data: e.errors,
                message: e.message
              });
            }
        
            return res.status(500).send({
              status: "error",
              data: {},
              message: "Something went wrong"
            });
          }  
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    let { email, password } = req.body;
    const person = await prisma.doctor.findUnique({
        where: {
         email: email
        }})
    if(person){
        bcryptjs.compare(password, person.password, (error, result) => {
            if (error) {
                return res.status(401).json({
                    message: 'Password Mismatch'
                });
            } else if (result) {
                signJWT(person, (_error, token) => {
                    if (_error) {
                        return res.status(401).json({
                            message: 'Unable to Sign JWT',
                            error: _error
                        });
                    } else if (token) {
                        return res.status(200).json({
                            message: 'Auth Successful',
                            token,
                            user: person
                        });
                    }
                });
            }
        });
    } else {
        return res.status(404).json({
            message: 'User not found',
        });
    }
};


export default { validateToken, register, login };