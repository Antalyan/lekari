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

const createReservation = async (doctorId: number, personId: number, fromTime: Date, toTime: Date, comment: string | undefined) => {
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

export default {
  getReservations,
  createReservation
};
