import prisma from '../client';

const upsert = async (doctorId: number, day: number, hour: string) => {
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
