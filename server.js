const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
require('dotenv').config();
require('./config/database');

const port = process.env.PORT || 4000;

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'build')));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/results', require('./routes/api/results'));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, function () {
    console.log(`Express app running on port ${port}`)
});