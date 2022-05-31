import { NextFunction, Request, Response } from 'express';
const {Prisma, PrismaClient} = require('@prisma/client');
//import { Prisma, PrismaClient } from '@prisma/client'
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
  const { surename, location, specialization, orderBy } = req.query

  const doctors = await prisma.doctor.findMany({
    where: {
      person:{
        surename: {
          contains: surename != null ? surename : undefined
        },
      },
      specialization: {
        contains: specialization != null ? specialization: undefined
      },
      address: {
        city: {
          contains: location != null ? location: undefined
        },
      }
    },
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

const doctorSchema = object({
  specialization: string().matches(/(chirirg|psychytr|ortoped)/),
  actuality:      string(),
  email:          string(),
  phone:          string(),
  description:    string(),
  link:           string(),
  profilePicture: string(),
  addressId:      string()
});

const doctorUpdate = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  try {
    const data = await doctorSchema.validate(req.body);
    const doctor = await prisma.doctor.updateMany({
      where: {
          id: id
      },
      data: data
    })

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

const doctorReservations = async (req: Request, res: Response, next: NextFunction) => {
  const reservations = await prisma.doctor.findMany({
    where: {
      person:{
          email: res.locals.jwt.username
      }
    },
    select: {
        reservations: {
            select: {
              person: {
                select: {
                    firstname: true,
                    surename: true,
                    degree: true,
                    email: true,
                    phone: true
                }
              },
              from: true,
              personComment: true,
              doctorComment: true,
              created: true
            }
        }
    }
  });

  if (!reservations) {
    return res.status(404).send({
      status: "error",
      data: {},
      message: "Person was not found"
    });
  }
 
  return res.send({
    status: "sucess",
    data: reservations[0],
  })
}

const doctorSlots = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const date = new Date(req.params.date);
  var tomorrow = new Date();
  tomorrow.setDate(date.getDate()+1);
  var weekday=new Array(7);
  weekday[0]="Monday";
  weekday[1]="Tuesday";
  weekday[2]="Wednesday";
  weekday[3]="Thursday";
  weekday[4]="Friday";
  weekday[5]="Saturday";
  weekday[6]="Sunday";
  const day = weekday[date.getDay()];
  

  const openingHours = await prisma.openingHours.findMany({
    where: {
      doctorId: id,
      day: day,
    },
    select: {
      fromTime: true,
      toTime: true,
      fromDate: true,
      interval:true
    }
  });

  const reservations = await prisma.reservation.findMany({
    where: {
      doctorId: id,
      from: {
        gte: date,
        lt: tomorrow,
      }
    },
    select: {
      from: true
    }
  });

  if (!openingHours) {
    return res.status(404).send({
      status: "error",
      data: {},
      message: "Opening hours was not found"
    });
  }
  let dateFrom = new Date(date)
  dateFrom.setTime(openingHours[0].fromTime.getTime())
  let allTimeSlots = []
  let time = openingHours[0].toTime.getTime() - openingHours[0].fromTime.getTime();
  let lastTime = new Date (dateFrom);
  for (let i = 0; i < (((time / 60) / openingHours[0].interval) / 1000); i++) {
    allTimeSlots.push(new Date(lastTime))
    lastTime.setMinutes( lastTime.getMinutes() + 30 )
  }

  const reservationsTimes = reservations.map((item: { from: any; }) => item.from.toLocaleString())
  let timeSlots = allTimeSlots.filter( function( el ) {
    return !reservationsTimes.includes(el.toLocaleString());
  } );

  return res.send({
    status: "sucess",
    data: timeSlots
  })
}

export default { doctorList, doctorDetail, doctorUpdate, doctorReservations, doctorSlots};