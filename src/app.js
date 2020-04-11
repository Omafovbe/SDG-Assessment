const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Import the routes module for the Estimation
const estimationRoutes = require('./routes');

const apiPort = 3000;
const app = express();

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

// Morgan to log method entries and status to file on the server
app.use(morgan(':method \t :url \t\t :status \t :response-time ms', { stream: accessLogStream }));


// Estimation API Routes
app.use('/api/v1/on-covid-19', estimationRoutes);

// Request / Response log cycle
app.get('/api/v1/on-covid-19/logs', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.sendFile(path.join(`${__dirname}/access.log`));
});

app.listen(apiPort, () => console.log(`Server listening at http://localhost:${apiPort}`));
