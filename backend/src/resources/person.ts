import { object, string, number, date, ValidationError, boolean } from 'yup';
import { Request, Response } from 'express'
import prisma from '../client';

const personSchema = object({
    name: string().required(),
    surename: string().required(),
    degree: string(),
    birthdate: date().required(),
    email: string().required(),
    phone: number(),
    insuranceNumber: number(),
    insuranceId: string(),
    country: string().required(),
    city: string().required(),
    postalCode: number().required(),
    street: string().required(),
    password: string().required(),
    profilePicture: string()
  });

export const store = async (req: Request, res: Response) => {
    try {
      const data = await personSchema.validate(req.body);
      const person = await prisma.person.create({
        data
      });
  
      return res.status(201).send({
        status: "success",
        data: person,
        message: "Animal stored in system"
      })
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
  }

  export const get = async (req: Request, res: Response) => {
    const id = req.params.id;
  
    const person = await prisma.person.findUnique({
      where: {
        id: id
      }
    });
  
    if (!person) {
      return res.status(404).send({
        status: "error",
        data: {},
        message: "Animal was not found"
      });
    }
  
    return res.send({
      status: "sucess",
      data: person
    })
  }