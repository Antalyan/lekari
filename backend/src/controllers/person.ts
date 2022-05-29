//import { prisma, PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
const {PrismaClient} = require('@prisma/client');
import { object, string, number, date, ValidationError, boolean } from 'yup';

const prisma = new PrismaClient()

const personList = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const persons = await prisma.person.findMany({})
        res.json(persons)
    } catch (error){
        next(error)
    }
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

/*api.post('/person', async(req, res, next) => {
   try {
       const data = await personSchema.validate(req.body);
       const person = await prisma.person.create({
         data
       });
   
       return res.status(201).send({
         status: "success",
         data: person,
         message: "Person registered."
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
});*/

const personDetail = async (req: Request, res: Response, next: NextFunction) => {
   const id = req.params.id;

 const person = await prisma.person.findUnique({
   where: {
     id: id
   },
   select: {
       firstname: true,
       surename: true,
       degree: true,
       email: true,
       phone: true,
       insuraceNumber: true,
       insurance: {
           select: {
               number: true,
               name: true,
           }
       },
       address: {
           select:{
               country: true,
               city: true,
               postalCode: true,
               street: true,
           }
       }
   }
 });

 if (!person) {
   return res.status(404).send({
     status: "error",
     data: {},
     message: "Person was not found"
   });
 }

 return res.send({
   status: "sucess",
   data: person,
   /*data: {
       firstname: person.firstname,
       surename: person.surename,
       degree: person.degree,
       email: person.email,
       phone: person.phone,
       insurance: {
           insuranceNumber: person.insuranceNumber,
           insuranceCompanyNumber: person.insurance.number,
           insuranceCompanyName: person.insurance.name
       },
       address: {
           country: person.address.country,
           city: person.address.city,
           postalCode: person.address.postalCode,
           street: person.address.street,
       }

   }*/
 })
}

const personUpdate = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  try {
    const data = await personSchema.validate(req.body);
    const person = await prisma.person.updateMany({
      where: {
          id: id
      },
      data: data
    })

    if (!person) {
      return res.status(404).send({
        status: "error",
        data: {},
        message: "Person was not found"
      });
    }

    return res.send({
      status: "sucess",
      data: person
    })
  } catch (e) {
    if (e instanceof ValidationError) {
      return res.status(400).send({
        status: "error",
        data: e.errors,
        message: e.message
      });
    }
  }
}

export default { personList, personDetail, personUpdate};