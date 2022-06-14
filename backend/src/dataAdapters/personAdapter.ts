const detail = (person: any) => {
  return {
    firstname: person.firstname,
    surname: person.surname,
    degree: person.degree || null,
    email: person.email,
    phone: person.phone,
    phonePrefix: person.phonePrefix,
    birthdate: person.birthdate,
    insuranceNumber: person.insuranceNumber || null,
    country: person.address.country,
    city: person.address.city,
    postalCode: person.address.postalCode,
    street: person.address.street || null,
    buildingNumber: person.address.buildingNumber,
  };
};

export default { detail };
