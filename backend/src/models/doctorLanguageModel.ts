import prisma from '../client';

const upsert = async (doctorId: number, language: string) => {
  return await prisma.doctorLanguage.upsert({
    where: {
      doctorId_language: {
        doctorId: doctorId,
        language: language
      }
    },
    update: {},
    create: {
      doctor: {
        connect: {
          id: doctorId
        }
      },
      language: language
    }
  });
};

export default { upsert };
