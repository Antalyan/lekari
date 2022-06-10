const token = (person: any) => {
  return {
    id: person.id,
    email: person.email,
  };
};

export default { token };
