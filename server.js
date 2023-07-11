const express = require('express');
const path = require('path');
const https = require('https');
const favicon = require('serve-favicon');
const logger = require('morgan');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();
require('./config/database');

const port = process.env.PORT || 4000;

const app = express();

//app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'build')));
app.use(require('./config/checkToken'));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/results', require('./routes/api/results'));

app.get('/api/survey', function (req, res) {
    const surveyFilePath = path.join(__dirname, 'survey.json');
    
    fs.readFile(surveyFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to read survey data.' });
      } else {
        try {
          const surveyData = JSON.parse(data);
          res.json(surveyData);
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to parse survey data.' });
        }
      }
    });
  });

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// const options = {
//   key: fs.readFileSync('./localhost-key.pem'),     
//   cert: fs.readFileSync('./localhost.pem'),    
// };

//const server = https.createServer(options, app);

app.listen(port, function () {
    console.log(`Express app running on port ${port}`)
});