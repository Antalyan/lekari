import express from 'express'

const api = express()

api.use(express.json());
api.use(express.urlencoded({ extended: true }));

api.get('/', (req, res) => res.send({
    status: "success",
    data: {},
    message: "Welcome to our API"
}));

/**
 * Start listening on connections
 */
api.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}`))