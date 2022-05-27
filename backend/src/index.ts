//import { prisma, PrismaClient } from '@prisma/client';
import express from 'express'
const {PrismaClient} = require('@prisma/client');
import { object, string, number, date, ValidationError, boolean } from 'yup';

const api = express()
const prisma = new PrismaClient()

api.use(express.json());
api.use(express.urlencoded({ extended: true }));

api.get('/', (req, res) => res.send({
    status: "success",
    data: {},
    message: "Welcome to our API"
}));

/**
 * Resource person
 */

 api.get('/person', async(req, res, next) => {
     try{
         const persons = await prisma.person.findMany({})
         res.json(persons)
     } catch (error){
         next(error)
     }
 });

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

api.post('/person', async(req, res, next) => {
    try{
        const persons = await prisma.person.create({
            data: {
                firstname: req.body.firstname,
                surename: req.body.surename,
                degree: req.body.degree,
                birthdate: new Date(req.body.birthdate),
                email: req.body.email,
                country: req.body.country,
                city: req.body.city,
                postalCode: req.body.postalCode,
                street: req.body.street,
                password: req.body.password,
            }
        })
        res.json(persons)
    } catch (error){
        next(error)
    }
});

api.get('/personal-info/:id', async(req, res, next)=>{
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
})

api.get('/doctors/:id', async(req, res, next)=>{
    const id = req.params.id;

  const doctor = await prisma.doctor.findUnique({
    where: {
      id: id
    },
    select: {
        person:{
            select: {
                firstname: true,
                surename: true,
                degree: true,
            }
        },
        specialization: true,
        email: true,
        phone: true,
        description: true,
        link: true,
        languages: {
            select:{
                language: true
            }
        },
        address: {
            select: {
                country: true,
                city: true,
                postalCode: true,
                street: true,
            }
        },
        profilePicture: true,
        actuality: true,
        openingHours: {
            select: {
                day: true,
                fromTime: true,
                toTime: true,
                fromDate: true,
            }
        },
        references: {
            select: {
                rate: true,
                comment: true,
                author: true,
                created: true,
            }
        }
    }
  });

  if (!doctor) {
    return res.status(404).send({
      status: "error",
      data: {},
      message: "Person was not found"
    });
  }

  return res.send({
    status: "sucess",
    data: doctor
  })
})

api.get('/doctors', async(req, res, next)=>{
  const doctors = await prisma.doctor.findMany({
    select: {
        id: true,
        person: {
            select: {
                firstname: true,
                surename: true,
            }
        },
        specialization: true,
        address:{
            select: {
                city: true,
            }
        },
        actuality: true,
      },
  });

  if (!doctors) {
    return res.status(404).send({
      status: "error",
      data: {},
      message: "Person was not found"
    });
  }

  return res.send({
    status: "sucess",
    data: doctors
  })
})
/**
 * Start listening on connections
 */
api.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}`))