import auth from './controllers/auth';
import person from './controllers/person';
import doctor from './controllers/doctor';
import express from 'express'

import extractJWT from './middleware/extractJWT';

const api = express()

api.use(express.json());
api.use(express.urlencoded({extended: true}));

api.get('/', (req, res) => res.send({
    status: "success",
    data: {},
    message: "Welcome to our API"
}));

/**
 * Resource person
 */

api.get('/doctors', doctor.doctorList)
api.get('/doctors/:id', doctor.doctorDetail)
api.patch('/doctors/:id', doctor.doctorUpdate)
api.get('/doctor-reservations', extractJWT, doctor.doctorReservations)


api.get('/persons', person.personList)
api.get('/personal-info', extractJWT, person.personDetail)
api.patch('/personal-info', extractJWT, person.personUpdate)
api.get('/person-reservations', extractJWT, person.personReservations)


api.get('/validate', extractJWT, auth.validateToken);
api.post('/register', auth.register);
api.post('/login', auth.login);

/**
 * Start listening on connections
 */
api.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}`))