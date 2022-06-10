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

export default { getMany };
