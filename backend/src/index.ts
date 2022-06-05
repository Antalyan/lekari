import auth from './controllers/auth';
import person from './controllers/person';
import doctor from './controllers/doctor';

import extractJWT from './middleware/extractJWT';

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
api.get('/doctors/:id(\\d+)', doctor.doctorDetail);
api.patch('/doctors/:id(\\d+)', doctor.doctorUpdate);
api.get('/doctor-reservations', extractJWT, doctor.doctorReservations);
api.get('/doctors/:id(\\d+)/slots/:date', doctor.doctorSlots);

api.post('/signup-doctor', doctor.signUp);
api.post('/doctors/:id(\d+)/reference', doctor.postReview);
api.post('/doctors/:doc_id(\d+)/reference/:ref_id(\d+)/comment', doctor.postComment);
api.post('/doctors/:id(\d+)/reservations', doctor.createReservation);
api.patch('/doctor-info', doctor.infoUpdate);

api.get('/persons', person.personList);                     // Undocumented
api.get('/personal-info', extractJWT, person.personDetail);
api.patch('/personal-info', extractJWT, person.personUpdate);
api.get('/person-reservations', extractJWT, person.personReservations);

api.post('/profile-image', person.updateImage);

api.get('/validate', extractJWT, auth.validateToken);       // Undocumented
api.post('/register', auth.register);
api.post('/login', auth.login);
api.put('/logout', auth.logout);

/**
 * Start listening on connections
 */
api.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}`));
