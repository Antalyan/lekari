const token = (person: any) => {
  return {
    id: person.id,
    email: person.email,
  };
};

const logged = (person: any, accessToken: string) => {
  return {
    id: person.id,
    firstName: person.firstname,
    surname: person.surname,
    token: accessToken,
    isDoctor: (person.doctor !== null && !person.doctor.deleted)
  };
};

export default {
  token,
  logged
};
