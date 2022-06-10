import { Person, PersonTmp } from '@prisma/client';

const person = (reservations: any) => {
  return reservations.map((reservation: any) => ({
    id: reservation.id,
    doctorDegree: reservation.doctor.person.degree,
    doctorFirstname: reservation.doctor.person.firstname,
    doctorSurname: reservation.doctor.person.surname,
    visitTimeFrom: reservation.fromTime.toLocaleTimeString(),
    visitTimeTo: reservation.toTime.toLocaleTimeString(),
    visitDate: reservation.fromTime.toISOString()
      .split('T')[0],
    note: reservation.personComment,
    createTime: reservation.created.toLocaleTimeString(),
    createDate: reservation.created.toISOString()
      .split('T')[0],
    workStreet: reservation.doctor.address.street,
    workBuildingNumber: reservation.doctor.address.buildingNumber,
    workCity: reservation.doctor.address.city,
  }));
};

const doctor = (reservations: any) => {
  return reservations.map((reservation: any) => {
    const person: Person | PersonTmp | null = reservation.person || reservation.personTmp;
    if (!person) return;
    return {
      id: reservation.id,
      personDegree: person.degree,
      personFirstname: person.firstname,
      personSurname: person.surname,
      visitTimeFrom: reservation.fromTime.toLocaleTimeString(),
      visitTimeTo: reservation.toTime.toLocaleTimeString(),
      visitDate: reservation.fromTime.toISOString()
        .split('T')[0],
      note: reservation.personComment,
      createTime: reservation.created.toLocaleTimeString(),
      createDate: reservation.created.toISOString()
        .split('T')[0],
    };
  });
};

export default {
  person,
  doctor
};
