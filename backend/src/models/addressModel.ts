import prisma from '../client';

const getDoctorsCities = async () => {
  return await prisma.address.findMany({
    where: {
      NOT: {
        doctor: null,
      },
      doctor: {
        deleted: false,
      }
    },
    distinct: ['city']
  });
};

export default { getDoctorsCities };
