require('dotenv').config();
console.log(process.env.JWT_SECRET);
//starting web server
const PORT = 3000;
const express = require('express');
const server = express();


const morgan = require('morgan');
server.use(morgan('dev'));

server.use(express.json()) 

const apiRouter = require('./api');
server.use('/api', apiRouter);

const { client } = require('./db');
client.connect();

server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});  


