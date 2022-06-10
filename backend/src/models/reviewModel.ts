import prisma from '../client';

const create = async (doctorId: number, data: any) => {
  return await prisma.review.create({
    data: {
      doctorId: doctorId,
      comment: data.comment,
      rate: (data.rate * 2),
      author: data.author || null
    }
  });
};

export default { create };
