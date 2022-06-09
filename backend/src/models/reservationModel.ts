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

export default { getReservations };
