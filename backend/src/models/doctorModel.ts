import prisma from '../client';

const getDoctorFromUserId = async (userId: number) => {
  return await prisma.person.findFirst({
    where: {
      deleted: false,
      id: userId,
      doctor: {
        deleted: false,
      }
    },
    include: {
      doctor: {
        include: {
          address: true,
          languages: true,
          openingHours: true,
          references: {
            orderBy: {
              created: 'desc'
            },
          },
        }
      },
    },
  });
};

const getDoctorIdFromUserId = async (userId: number) => {
  return await prisma.person.findFirst({
    where: {
      deleted: false,
      id: userId,
      NOT: {
        doctor: null,
      },
      doctor: {
        deleted: false,
      }
    },
    select: {
      doctor: {
        select: {
          id: true,
        }
      }
    }
  });
};

export default {
  getDoctorFromUserId,
  getDoctorIdFromUserId
};
