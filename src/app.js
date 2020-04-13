const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Import the routes module for the Estimation
const estimationRoutes = require('./routes');

const apiPort = process.env.PORT || 3000;
const app = express();

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs.txt'), { flags: 'a' });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

// Morgan to log method entries and status to file on the server
app.use(morgan(':method \t :url \t :status \t 0:response-time[0]ms', { stream: accessLogStream }));


// Estimation API Routes
app.use('/api/v1/on-covid-19', estimationRoutes);

// Request / Response log cycle
app.get('/api/v1/on-covid-19/logs', (req, res) => {
  const data = fs.readFileSync(`${__dirname}/logs.txt`, 'utf8');
  res.set('Content-Type', 'text/plain');
  // res.sendFile(path.join(`${__dirname}/logs.txt`));
  res.send(data);
});

app.listen(apiPort, () => console.log(`Server listening at http://localhost:${apiPort}`));
