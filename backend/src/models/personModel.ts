import prisma from '../client';

const getPerson = async (where: any) => {
  return await prisma.person.findFirst({
    where: {
      deleted: false, ...where,
    },
    include: {
      doctor: {
        include: {
          address: true,
          references: true,
          languages: true,
          openingHours: true,
          reservations: {
            orderBy: {
              fromTime: 'asc'
            },
            where: {
              fromTime: {
                gte: new Date(),
              }
            }
          },
          reservationHours: {
            orderBy: [{
              day: 'asc',
            },],
            distinct: ['day']
          },
        },
      },
      address: true,
      reservations: {
        orderBy: {
          fromTime: 'asc'
        },
        where: {
          fromTime: {
            gte: new Date(),
          }
        }
      },
    }
  });
};

const remove = async (personId: number) => {
  return await prisma.person.updateMany({
    where: {
      id: personId,
    },
    data: {
      deleted: true,
    }
  });
};

const updateDoctor = async (personId: number, data: any, hash: string) => {
  return await prisma.person.update({
    where: {
      id: personId,
    },
    data: {
      firstname: data.firstname,
      surname: data.surname,
      degree: data.degree || null,
      birthdate: data.birthdate,
      email: data.email,
      phonePrefix: data.phonePrefix,
      phone: data.phone,
      insuranceNumber: data.insuranceNumber || null,
      password: hash,
      address: {
        update: {
          country: data.country,
          city: data.city,
          postalCode: data.postalCode,
          street: data.street || null,
          buildingNumber: data.buildingNumber,
        }
      },
      doctor: {
        update: {
          specialization: data.specialization,
          actuality: data.actuality || null,
          address: {
            update: {
              country: data.workCountry,
              city: data.workCity,
              postalCode: data.workPostalCode,
              street: data.workStreet || null,
              buildingNumber: data.workBuildingNumber,
            }
          },
        }
      },
    }
  });
};

export default {
  getPerson,
  remove,
  updateDoctor
};
