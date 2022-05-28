//import { prisma, PrismaClient } from '@prisma/client';
import auth from './controllers/auth';
import person from './controllers/person';
import doctor from './controllers/doctor';
import express from 'express'
const {PrismaClient} = require('@prisma/client');
import { object, string, number, date, ValidationError, boolean } from 'yup';


const api = express()
const prisma = new PrismaClient()

api.use(express.json());
api.use(express.urlencoded({ extended: true }));

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

api.get('/persons', person.personList)
api.get('/personal-info/:id', person.personDetail)

api.get('/validate', auth.validateToken);
api.post('/register', auth.register);
api.post('/login', auth.login);
/**
 * Start listening on connections
 */
api.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}`))