import { Review } from '@prisma/client';

const formatReviews = (reviews: Review[], utc: boolean = false) => {
  return reviews.map(review => {
    const createDate = utc ? review.created.toUTCString() : (review.created.toISOString()
      .split('T')[0]);
    return {
      rate: review.rate / 2,
      comment: review.comment,
      author: review.author,
      createDate: createDate,
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
    languages: person.doctor.languages.map((language: { language: string; }) => language.language),
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

const list = (doctors: any[]) => {
  return doctors.map((doctor: any) => {
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

const allInfo = (person: any, openingHours: any, reviewsSum: number, reviews: any) => {
  return {
    degree: person.degree,
    firstname: person.firstname,
    surname: person.surname,
    birthdate: person.birthdate,
    email: person.email,
    phonePrefix: person.phonePrefix,
    phone: person.phone,
    insuranceNumber: person.insuranceNumber,
    specialization: person.doctor.specialization,
    country: person.address.country,
    city: person.address.city,
    postalCode: person.address.postalCode,
    street: person.address.street,
    buildingNumber: person.address.buildingNumber,
    workEmail: person.doctor.email,
    workPhone: person.doctor.phone,
    description: person.doctor.description,
    link: person.doctor.link,
    languages: person.doctor.languages.map((language: { language: string; }) => language.language),
    workCountry: person.doctor.address.country,
    workCity: person.doctor.address.city,
    workPostalCode: person.doctor.address.postalCode,
    workStreet: person.doctor.address.street,
    workBuildingNumber: person.doctor.address.buildingNumber,
    profilePicture: person.doctor.profilePicture,
    actuality: person.doctor.actuality,
    openingHours: openingHours,
    rateAverage: (Math.round((reviewsSum / person.doctor.references.length) * 2) / 2),
    reviews: reviews,
    reservationHours: person.doctor.reservationHours,
  };
};

export default {
  formatReviews,
  formatDetail,
  list,
  allInfo
};
