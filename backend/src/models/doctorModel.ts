import prisma from '../client';

const getDoctorFromPerson = async (personId: number) => {
  return await prisma.person.findFirst({
    where: {
      deleted: false,
      id: personId,
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
            }
          }
        }
      },
    },
  });
};

export default getDoctorFromPerson;
