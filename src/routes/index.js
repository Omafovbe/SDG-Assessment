const express = require('express');
const xml = require('xml2js');
const { check, validationResult } = require('express-validator');
const covid19ImpactEstimator = require('../estimator');

const router = express.Router();

// Validate input data
const inputDataValidation = [
  check('region.avgDailyIncomePopulation').isDecimal(),
  check('region.avgDailyIncomeInUSD').isNumeric(),
  check('periodType').isString(),
  check('timeToElapse').isNumeric(),
  check('reportedCases').isNumeric(),
  check('totalHospitalBeds').isNumeric()
];

// XML Builder Instance
const builder = new xml.Builder();

router.get('/', (req, res) => {
  res.send('<h3>COVID-19 Assessment for SDG Project</h3>');
});

router.post('/:header?', inputDataValidation, (req, res) => {
  const errors = validationResult(req);

  // Display validation error if required fields is not supplied as required
  if (!errors.isEmpty()) {
    // If the header is xml return in XML format
    // Else in JSON format
    if (req.params.header === 'xml') {
      res.set('Content-Type', 'application/xml');
      res.send(builder.buildObject({ error: errors.array() }));
    } else {
      return res.status(422).json({ errors: errors.array() });
    }
  }

  // Display the result
  const input = req.body;
  const { data, impact, severeImpact } = covid19ImpactEstimator(input);

  // Display the result in XML if xml header was requested.
  if (req.params.header === 'xml') {
    res.set('Content-Type', 'application/xml');
    res.send(builder.buildObject({ data, impact, severeImpact }));
  }

  return res.status(200).json({ data, impact, severeImpact });
});

module.exports = router;
