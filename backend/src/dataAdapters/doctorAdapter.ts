import { Review } from '@prisma/client';

const formatReviews = (reviews: Review[]) => {
  return reviews.map(function (review) {
    return {
      rate: review.rate / 2,
      comment: review.comment,
      author: review.author,
      createDate: review.created.toISOString()
        .split('T')[0],
      createTime: review.created.toLocaleTimeString()
    };
  });
};

const formatDetail = (person: any, openingHours: any, reviewsSum: number, reviews: any) => {
  return {
    degree: person.degree,
    firstname: person.firstname,
    surname: person.surname,
    specialization: person.doctor.specialization,
    workEmail: person.doctor.email,
    workPhone: person.doctor.phone,
    description: person.doctor.description,
    link: person.doctor.link,
    languages: person.doctor.languages.map(language => language.language),
    workCountry: person.doctor.address.country,
    workCity: person.doctor.address.city,
    workPostalCode: person.doctor.address.postalCode,
    workStreet: person.doctor.address.street,
    workBuildingNumber: person.doctor.address.buildingNumber,
    profilePicture: person.doctor.profilePicture,
    actuality: person.doctor.actuality,
    openingHours: openingHours,
    rateAverage: Math.round((reviewsSum / person.doctor.references.length) * 2) / 2,
    reviews: reviews
  };
};

const list = (doctors) => {
  return doctors.map(doctor => {
    return {
      id: doctor.person.id,
      degree: doctor.person.degree,
      firstname: doctor.person.firstname,
      surname: doctor.person.surname,
      specialization: doctor.specialization,
      city: doctor.address.city,
      actuality: doctor.actuality
    };
  });
};

export default {
  formatReviews,
  formatDetail,
  list
};
