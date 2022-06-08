import { Request, Response } from 'express';
import prisma from '../client';

export const personReservations = async (req: Request, res: Response) => {
  const date = new Date();
  const reservations = await prisma.person.findMany({
    where: {
      email: res.locals.jwt.email,
      deleted: false
    },
    select: {
      reservations: {
        where: {
          fromTime: {
            gte: date,
          }
        },
        orderBy: {
          fromTime: 'asc'
        },
        select: {
          id: true,
          doctor: {
            select: {
              person: {
                select: {
                  firstname: true,
                  surname: true,
                  degree: true,
                }
              },
              address: {
                select: {
                  city: true,
                  street: true,
                  buildingNumber: true,
                }
              },
              specialization: true,
              email: true,
            }
          },
          fromTime: true,
          toTime: true,
          personComment: true,
          created: true
        }
      }
    }
  });

  if (!reservations || reservations.length == 0) {
    return res.status(404)
      .send({
        status: 'error',
        data: {},
        message: 'Person was not found'
      });
  }

  let data = (reservations[0]).reservations.map(
    function (reservation) {
      return {
        id: reservation.id,
        doctorDegree: reservation.doctor.person.degree,
        doctorFirstname: reservation.doctor.person.firstname,
        doctorSurname: reservation.doctor.person.surname,
        visitTimeFrom: reservation.fromTime.toLocaleTimeString(),
        visitTimeTo: reservation.toTime.toLocaleTimeString(),
        visitDate: reservation.fromTime.toISOString()
          .split('T')[0],
        note: reservation.personComment,
        createTime: reservation.created.toLocaleTimeString(),
        createDate: reservation.created.toISOString()
          .split('T')[0],
        workStreet: reservation.doctor.address.street,
        workBuildingNumber: reservation.doctor.address.buildingNumber,
        workCity: reservation.doctor.address.city,
      };
    }
  );

  return res.send({
    status: 'success',
    data: { reservations: data }
  });
};

export default { personReservations };
