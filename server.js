const express = require('express');
const logger = require('npmlog');
const bodyParser = require('body-parser');
const jsonwebtoken = require("jsonwebtoken");


// create express app
const app = express();
const port = process.env.PORT || 3000;

// body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//routes


// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
	useNewUrlParser: true,useUnifiedTopology: true
}).then(() => {
  logger.info("Successfully connected to the database");    
}).catch(err => {
  logger.error('Could not connect to the database. Exiting now...', err);
    process.exit();
});


// authentication 
app.use(function(req, res, next) {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
      jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
        if (err) req.user = undefined;
        req.user = decode;
        next();
      });
    } else {
      req.user = undefined;
      next();
    }
  });





  // 404 handler
  app.use('*', (req, res, next) => {
    next(new ServerError('API_NOT_FOUND', 404));
  });

  // error handler
  app.use((err, req, res, next) => {
    logger.error('Error Message >', err.message);
    if (!err.status) {
        logger.error('Stack >', err.stack);
      // console.error(err);
      process.exit(0);
    }
    res.status(err.status).json({ message: err.message, status: err.status });
  });

// listen for requests
app.listen(port, () => {
    logger.info("Server is listening on port",port);
});