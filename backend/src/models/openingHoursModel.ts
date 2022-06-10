import prisma from '../client';

const upsert = async (doctorId: number, day: number, hour: string | null | undefined) => {
  return await prisma.openingHours.upsert({
    where: {
      doctorId_day: {
        doctorId: doctorId,
        day: day
      }
    },
    update: {
      opening: hour
    },
    create: {
      doctor: {
        connect: {
          id: doctorId,
        }
      },
      day: day,
      opening: hour
    }
  });
};

export default { upsert };
