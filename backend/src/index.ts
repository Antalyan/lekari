import auth from './controllers/auth';
import person from './controllers/person';
import doctor from './controllers/doctor';

import { Request, Response } from 'express';
import reservation from './controllers/reservation';

const cors = require('cors');
const express = require('express');
const api = express();

api.use(cors());
api.use(express.json());
api.use(express.urlencoded({ extended: true }));

api.get('/', (req: any, res: { send: (arg0: { status: string; data: {}; message: string; }) => any; }) => res.send({
  status: 'success',
  data: {},
  message: 'Welcome to our API'
}));

/**
 * Resource person
 */

api.get('/doctors', doctor.doctorList);
api.get('/doctors-locations', doctor.locationList);
api.get('/doctors/:id(\\d+)', doctor.doctorDetail);
api.get('/doctor-reservations', auth.validateTokenDoctor, reservation.doctorReservations);
api.get('/doctors/:id(\\d+)/slots/:date', doctor.doctorSlots);
api.get('/doctor-info', auth.validateTokenDoctor, doctor.doctorInfoAll);
api.get('/doctor-reservation-hours', auth.validateTokenDoctor, reservation.reservationHoursGet);

api.post('/signup-doctor', doctor.signUp);
api.post('/doctors/:id(\\d+)/review', doctor.postReview);
api.patch('/doctor-info', auth.validateTokenDoctor, doctor.infoUpdate);
api.delete('/doctor-info', auth.validateTokenDoctor, doctor.doctorDelete);
api.post('/doctor/:id(\\d+)/reservations-registered', auth.validateToken, reservation.createReservationRegistered);
api.post('/doctor/:id(\\d+)/reservations-nonregistered', reservation.createReservationNonregistered);
api.post('/doctor-reservation-hours', auth.validateTokenDoctor, reservation.reservationHoursPost);
api.put('/doctor-details', auth.validateTokenDoctor, doctor.detailsUpdate);

api.get('/persons', person.personList);                     // Undocumented
api.get('/personal-info', auth.validateToken, person.personDetail);
api.patch('/personal-info', auth.validateToken, person.personUpdate);
api.get('/person-reservations', auth.validateToken, reservation.personReservations);
api.delete('/personal-info', auth.validateToken, person.personDelete);

api.get('/validate', auth.validateToken, (req: Request, res: Response) => {
  return res.sendStatus(200);
});       // Undocumented
api.post('/register', auth.register);
api.post('/login', auth.login);
api.put('/logout', auth.logout);

/**
 * Start listening on connections
 */
api.listen(process.env.PORT, () => console.log(`Doctor app listening on port ${process.env.PORT}`));
