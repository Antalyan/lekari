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

const getDoctorFromUserEmail = async (email: string) => {
  return await prisma.doctor.findFirst({
    where: {
      deleted: false,
      person: {
        email: email,
        deleted: false
      }
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

const getDoctors = async (surname: string, specialization: string, location: string) => {
  return await prisma.doctor.findMany({
    orderBy: [{
      specialization: 'asc',
    }, {
      person: {
        surname: 'asc',
      }
    },],
    where: {
      person: {
        surname: {
          contains: surname || undefined
        },
        deleted: false,
      },
      specialization: {
        contains: specialization || undefined
      },
      address: {
        city: {
          contains: location || undefined
        },
      },
      deleted: false,
    },
    include: {
      person: true,
      address: true,
    },
  });
};

export default {
  getDoctorFromUserId,
  getDoctorIdFromUserId,
  getDoctorFromUserEmail,
  getDoctors
};
