import auth from './controllers/auth';
import person from './controllers/person';
import doctor from './controllers/doctor';

import validateToken from './middleware/extractJWT';
import { Request, Response } from 'express';

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
api.get('/doctor-reservations', validateToken, doctor.doctorReservations);
api.get('/doctors/:id(\\d+)/slots/:date', doctor.doctorSlots);
api.get('/doctor-info', validateToken, doctor.doctorInfoAll);

api.post('/signup-doctor', doctor.signUp);
api.post('/doctors/:id(\\d+)/review', doctor.postReview);
api.patch('/doctor-info',validateToken, doctor.infoUpdate);
api.delete('/doctor-info', validateToken, doctor.doctorDelete);
api.post('/doctor/:id(\\d+)/reservations-registered', validateToken, doctor.createReservationRegistered);
api.post('/doctor/:id(\\d+)/reservations-nonregistered', doctor.createReservationNonregistered);

api.get('/persons', person.personList);                     // Undocumented
api.get('/personal-info', validateToken, person.personDetail);
api.patch('/personal-info', validateToken, person.personUpdate);
api.get('/person-reservations', validateToken, person.personReservations);
api.delete('/personal-info', validateToken, person.personDelete);

api.get('/validate', validateToken, (req: Request, res: Response) => {
  return res.sendStatus(200);
});       // Undocumented
api.post('/register', auth.register);
api.post('/login', auth.login);
api.put('/logout', auth.logout);

/**
 * Start listening on connections
 */
api.listen(process.env.PORT, () => console.log(`Doctor app listening on port ${process.env.PORT}`));
