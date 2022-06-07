import prisma from '../client';

const getPerson = async (where: any) => {
  return await prisma.person.findFirst({
    where: {
      deleted: false, ...where,
    },
    include: {
      doctor: true,
    },
  });
};

export default getPerson;
