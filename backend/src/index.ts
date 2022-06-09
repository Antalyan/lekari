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

/**
 * Resource person
 */

api.get('/doctors', doctor.list);
api.get('/doctors-locations', doctor.locations);
api.get('/doctors/:id(\\d+)', doctor.detail);
api.get('/doctor-reservations', auth.validateTokenDoctor, reservation.doctor);
api.delete('/doctor-reservations', auth.validateTokenDoctor, reservation.doctorRemove);
api.get('/doctors/:id(\\d+)/slots/:date', doctor.slots);
api.get('/doctor-info', auth.validateTokenDoctor, doctor.allInfo);
api.get('/doctor-reservation-hours/:date', auth.validateTokenDoctor, reservation.hoursGet);

api.post('/signup-doctor', auth.registerDoctor);
api.post('/doctors/:id(\\d+)/review', doctor.postReview);
api.patch('/doctor-info', auth.validateTokenDoctor, doctor.infoUpdate);
api.delete('/doctor-info', auth.validateTokenDoctor, doctor.remove);
api.post('/doctor/:id(\\d+)/reservations-registered', auth.validateToken, reservation.createRegistered);
api.post('/doctor/:id(\\d+)/reservations-nonregistered', reservation.createNotRegistered);
api.post('/doctor-reservation-hours', auth.validateTokenDoctor, reservation.hoursPost);
api.put('/doctor-details', auth.validateTokenDoctor, doctor.detailUpdate);

api.get('/persons', person.list);                     // Undocumented
api.get('/personal-info', auth.validateToken, person.detail);
api.patch('/personal-info', auth.validateToken, person.update);
api.get('/person-reservations', auth.validateToken, reservation.person);
api.delete('/person-reservations', auth.validateToken, reservation.personRemove);
api.delete('/personal-info', auth.validateToken, person.remove);

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
