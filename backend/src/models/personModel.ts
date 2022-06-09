import prisma from '../client';

const getPerson = async (where: any) => {
  return await prisma.person.findFirst({
    where: {
      deleted: false, ...where,
    },
    include: {
      doctor: {
        include: {
          address: true,
          references: true,
          languages: true,
          openingHours: true,
          reservations: {
            orderBy: {
              fromTime: 'asc'
            },
            where: {
              fromTime: {
                gte: new Date(),
              }
            }
          },
          reservationHours: {
            orderBy: [{
              day: 'asc',
            },],
            distinct: ['day']
          },
        },
      },
      address: true,
      reservations: {
        orderBy: {
          fromTime: 'asc'
        },
        where: {
          fromTime: {
            gte: new Date(),
          }
        }
      },
    }
  });
};

const remove = async (personId: number) => {
  return await prisma.person.updateMany({
    where: {
      id: personId,
    },
    data: {
      deleted: true,
    }
  });
};

export default {
  getPerson,
  remove
};
