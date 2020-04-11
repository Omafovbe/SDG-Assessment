const Estimator = ({ data, factor }) => {
  // currently Infected
  const currentlyInfected = () => data.reportedCases * factor;

  const infectionsByRequestedTime = () => {
    // Get currently infected persons
    const personsInfected = currentlyInfected(factor);
    let powFactor;

    // Determine the power factor by first reducing to days (if periodType is not in days)
    // Then divide by 3. For curretly infected persons doubles in 3 days
    if (data.periodType === 'days') {
      powFactor = Math.trunc(data.timeToElapse / 3);
    } else
    if (data.periodType === 'weeks') {
      powFactor = Math.trunc((data.timeToElapse * 7) / 3);
    } else
    if (data.periodType === 'months') {
      powFactor = Math.trunc((data.timeToElapse * 30) / 3);
    }

    return Math.trunc(personsInfected * (2 ** powFactor));
  };

  // Severe Cases function
  const severeCasesByRequestedTime = () => Math.trunc(infectionsByRequestedTime(factor) * 0.15);

  // Hospital Beds Function
  const hospitalBedsByRequestedTime = () => {
    const severeCases = severeCasesByRequestedTime(factor);
    return Math.trunc((data.totalHospitalBeds * 0.35) - severeCases);
  };

  // ICU function
  const casesForICUByRequestedTime = () => Math.trunc(infectionsByRequestedTime(factor) * 0.05);

  // Ventilation function
  const casesForVentByRequestedTime = () => Math.trunc(infectionsByRequestedTime(factor) * 0.02);

  // dollarIn Flight FUnction
  const dollarsInFlight = () => {
    const regData = data.region;
    return Math.trunc(infectionsByRequestedTime(factor)
      * regData.avgDailyIncomePopulation * regData.avgDailyIncomeInUSD);
  };

  // return module functions
  return {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime,
    casesForICUByRequestedTime,
    casesForVentByRequestedTime,
    dollarsInFlight
  };
};


const covid19ImpactEstimator = (data) => {
  const impact = {};
  const severeImpact = {};
  const impactEstimator = Estimator({ data, factor: 10 });
  const sImpactEstimator = Estimator({ data, factor: 50 });

  impact.currentylyInfected = impactEstimator.currentlyInfected();
  severeImpact.currentylyInfected = sImpactEstimator.currentlyInfected();

  impact.infectionsByRequestedTime = impactEstimator.infectionsByRequestedTime();
  severeImpact.infectionsByRequestedTime = sImpactEstimator.infectionsByRequestedTime();

  impact.severeCasesByRequestedTime = impactEstimator.severeCasesByRequestedTime();
  severeImpact.severeCasesByRequestedTime = sImpactEstimator.severeCasesByRequestedTime();

  impact.hospitalBedsByRequestedTime = impactEstimator.hospitalBedsByRequestedTime();
  severeImpact.hospitalBedsByRequestedTime = sImpactEstimator.hospitalBedsByRequestedTime();

  impact.casesForICUByRequestedTime = impactEstimator.casesForICUByRequestedTime();
  severeImpact.casesForICUByRequestedTime = sImpactEstimator.casesForICUByRequestedTime();

  impact.casesForVentilatorsByRequestedTime = impactEstimator.casesForVentByRequestedTime();
  severeImpact.casesForVentilatorsByRequestedTime = sImpactEstimator.casesForVentByRequestedTime();

  impact.dollarsInFlight = impactEstimator.dollarsInFlight();
  severeImpact.dollarsInFlight = sImpactEstimator.dollarsInFlight();

  return {
    data,
    estimate: {
      impact,
      severeImpact
    }
  };
};

module.exports = covid19ImpactEstimator;
