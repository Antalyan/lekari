import prisma from '../client';

const getFromUserId = async (userId: number) => {
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

const getDoctors = async (surname: string | null | undefined, specialization: string | null | undefined, location: string | null | undefined) => {
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

const removeDoctor = async (doctorId: number) => {
  return await prisma.doctor.updateMany({
    where: {
      id: doctorId,
    },
    data: {
      deleted: true,
    }
  });
};

const update = async (doctorId: number, data: any) => {
  return await prisma.doctor.update({
    where: {
      id: doctorId
    },
    data: {
      email: data.workEmail || null,
      phone: data.workPhone || null,
      description: data.description || null,
      link: data.link || null,
    }
  });
};

export default {
  getFromUserId,
  getDoctors,
  removeDoctor,
  update
};
