import { NextFunction, Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import signJWT from '../functions/signJWT';
import IUser from '../interfaces/person';
const {PrismaClient} = require('@prisma/client');
import { Prisma } from '@prisma/client'
import { object, string, number, date, ValidationError, boolean } from 'yup';

const NAMESPACE = 'User';

const prisma = new PrismaClient()

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
        message: 'Token(s) validated'
    });
};

const personSchema = object({
    firstname: string().required(),
    surename: string(),
    degree: string(),
    birthdate: date(),
    email: string(),
    phone: number(),
    insuranceNumber: number(),
    insuranceCode: number(),
    insuranceName: string(),
    country: string(),
    city: string(),
    postalCode: number(),
    street: string(),
    password: string(),
    profilePicture: string(),
  });

const register = async (req: Request, res: Response, next: NextFunction) => {
    let { password } = req.body;
    let person: Prisma.PersonCreateInput
    try {
        const data = await personSchema.validate(req.body);
        const hash = await bcryptjs.hash(password, 10);
        let p = {
            firstname: data.firstname,
            surename: data.surename,
            degree: data.degree,
            birthdate: data.birthdate,
            email: data.email,
            insuraceNumber: data.insuranceNumber,
            phone: data.phone,
            insurance:{
                create: {
                number: data.insuranceCode,
                name:   data.insuranceName
                }
            },
            address: {
                create: {
                country: data.country,
                city: data.city,
                postalCode: data.postalCode,
                street: data.street,
                }
            },
            password: hash
        }
            const person = await prisma.person.create({
            data: p
            });
        if(person){
            return res.status(201).send({
                status: "success",
                data: person,
                message: "Person registered."
            })
        } else{
            return res.status(500).send({
                status: "error",
                message: "",
            })
        }
        } catch (e) {
            if (e instanceof ValidationError) {
            return res.status(400).send({
                status: "error",
                data: e.errors,
                message: e.message
            });
            }
            if (e instanceof Error)
            {
                return res.status(500).send({
                    status: "error",
                    data: e.message,
                    message: "Something went wrong"
                    });
            }
        }  
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    let { email, password } = req.body;

    const person = await prisma.person.findMany({
        where: {
         email: email
        }})
    if(person){
        bcryptjs.compare(password, person[0].password, (error, result) => {
            if (error) {
                return res.status(401).json({
                    message: 'Password Mismatch'
                });
            } else if (result) {
                signJWT(person[0], (_error, token) => {
                    if (_error) {
                        return res.status(401).json({
                            message: 'Unable to Sign JWT',
                            error: _error
                        });
                    } else if (token) {
                        return res.status(200).json({
                            message: 'Auth Successful',
                            token,
                            user: person[0]
                        });
                    }
                });
            } else {
                return res.status(600).json({
                    message: 'Bad password',
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