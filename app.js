const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const config = require('./src/config/environment');
const bodyParser = require('body-parser');
const errorHandlerMiddleware = require('./src/util/express-js/errorHandlerMiddleware');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
        console.error('MongoDB connection error: ' + err);
        process.exit(-1);
    }
);

const app = express();
const server = require('http').createServer(app);

// before router
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./routes')(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorHandlerMiddleware);

// Start server
server.listen(config.port, config.ip, function () {
    console.log('Express http server listening on %d, in %s mode', config.port, app.get('env'));
});

module.exports = app;
