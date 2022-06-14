import prisma from '../client';

const getMany = async (doctorId: number, date: Date) => {
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

const get = async (doctorId: number, day: number, data: any) => {
  return await prisma.reservationHours.findFirst({
    where: {
      doctorId: doctorId,
      day: day,
      fromDate: {
        lte: new Date(data.date)
      }
    },
    orderBy: {
      fromDate: 'desc'
    },
  });
};

export default {
  getMany,
  get
};
