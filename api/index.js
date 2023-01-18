
//The express object is useful for more than creating a server. Here we use the Router function to create a new router, and then export it from the script.
const express = require('express');
const apiRouter = express.Router();

const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;