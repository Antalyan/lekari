import { NextFunction, Request, Response } from 'express';
const {PrismaClient} = require('@prisma/client');
import { object, string, number, date, ValidationError, boolean } from 'yup';

const prisma = new PrismaClient()

const doctorDetail = async (req: Request, res: Response, next: NextFunction) => {
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
}

const doctorList = async (req: Request, res: Response, next: NextFunction) => {
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
}

export default { doctorList, doctorDetail};