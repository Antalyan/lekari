import prisma from '../client';

const getReservations = async (where: any) => {
  return await prisma.reservation.findMany({
    where: where,
    orderBy: {
      fromTime: 'asc'
    },
    include: {
      doctor: {
        include: {
          person: true,
          address: true,
        }
      },
      person: true,
      personTmp: true,
    }
  });
};

const createReservation = async (doctorId: number, personId: number, fromTime: Date, toTime: Date, comment: string | null | undefined) => {
  return await prisma.reservation.create({
    data: {
      doctor: { connect: { id: doctorId } },
      person: { connect: { id: personId } },
      fromTime: fromTime,
      toTime: toTime,
      personComment: comment,
    }
  });
};

const createReservationNotRegistered = async (doctorId: number, fromTime: Date, toTime: Date, data: any) => {
  if (data.country && data.city && data.postalCode && data.buildingNumber) {
    return await prisma.reservation.create({
      data: {
        doctor: { connect: { id: doctorId } },
        personTmp: {
          create: {
            firstname: data.firstname,
            surname: data.surname,
            degree: data.degree || null,
            birthdate: data.birthdate,
            email: data.email || null,
            insuranceNumber: data.insuranceNumber || null,
            phonePrefix: data.phonePrefix,
            phone: data.phone,
            address: {
              create: {
                country: data.country,
                city: data.city,
                street: data.street || null,
                postalCode: data.postalCode,
                buildingNumber: data.buildingNumber,
              }
            }
          }
        },
        fromTime: fromTime,
        toTime: toTime,
        personComment: data.comment,
      }
    });
  } else {
    return await prisma.reservation.create({
      data: {
        doctor: { connect: { id: doctorId } },
        personTmp: {
          create: {
            firstname: data.firstname,
            surname: data.surname,
            degree: data.degree || null,
            birthdate: data.birthdate,
            email: data.email || null,
            insuranceNumber: data.insuranceNumber || null,
            phonePrefix: data.phonePrefix,
            phone: data.phone
          }
        },
        fromTime: fromTime,
        toTime: toTime,
        personComment: data.comment,
      }
    });
  }
};

const getReservationHours = async (doctorId: number, date: Date) => {
  return await prisma.reservationHours.findMany({
    orderBy: {
      fromDate: 'desc'
    },
    where: {
      doctorId: doctorId,
      day: date.getDay(),
      fromDate: {
        lte: date
      }
    },
    distinct: ['day'],
    select: {
      fromTime: true,
      toTime: true,
      fromDate: true,
      interval: true
    }
  });
};

const remove = async (where: any) => {
  return await prisma.reservation.deleteMany({
    where: where,
  });
};

export default {
  getReservations,
  createReservation,
  createReservationNotRegistered,
  getReservationHours,
  remove
};
