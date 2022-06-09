import prisma from '../client';

const getDoctorsCities = async () => {
  return await prisma.address.findMany({
    where: {
      NOT: {
        doctor: null,
      }
    },
    distinct: ['city']
  });
};

export default { getDoctorsCities };
