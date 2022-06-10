const person = (reservations: any) => {
  return reservations.map(reservation => ({
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

export default { person };
