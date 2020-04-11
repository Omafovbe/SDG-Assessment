const covid19ImpactEstimator = (data) => {
  const impact = {};
  const severeImpact = {};
  let numOfDays;
  // const impactEstimator = Estimator({ data, factor: 10 });
  // const sImpactEstimator = Estimator({ data, factor: 50 });

  if (data.periodType === 'days') {
    numOfDays = data.timeToElapse;
  } else
  if (data.periodType === 'weeks') {
    numOfDays = data.timeToElapse * 7;
  } else
  if (data.periodType === 'months') {
    numOfDays = data.timeToElapse * 30;
  }

  impact.currentlyInfected = data.reportedCases * 10;
  severeImpact.currentlyInfected = data.reportedCases * 50;

  const powFactor = Math.trunc(numOfDays / 3);

  const infections = impact.currentlyInfected * (2 ** powFactor);
  const sInfections = severeImpact.currentlyInfected * (2 ** powFactor);

  impact.infectionsByRequestedTime = Math.trunc(impact.currentlyInfected * (2 ** powFactor));
  severeImpact.infectionsByRequestedTime = Math.trunc(
    severeImpact.currentlyInfected * (2 ** powFactor)
  );

  const severeCase = infections * 0.15;
  const sSevereCase = sInfections * 0.15;

  const bedAvailability = 0.35 * data.totalHospitalBeds;

  impact.severeCasesByRequestedTime = Math.trunc(severeCase);
  severeImpact.severeCasesByRequestedTime = Math.trunc(sSevereCase);

  impact.hospitalBedsByRequestedTime = Math.trunc(bedAvailability - severeCase);
  severeImpact.hospitalBedsByRequestedTime = Math.trunc(bedAvailability - sSevereCase);

  impact.casesForICUByRequestedTime = Math.trunc(impact.infectionsByRequestedTime * 0.05);
  severeImpact.casesForICUByRequestedTime = Math.trunc(severeImpact.infectionsByRequestedTime
    * 0.05);

  impact.casesForVentilatorsByRequestedTime = Math.trunc(impact.infectionsByRequestedTime * 0.02);
  severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(
    severeImpact.infectionsByRequestedTime * 0.02
  );

  const regData = data.region;

  impact.dollarsInFlight = Math.trunc((impact.infectionsByRequestedTime
      * regData.avgDailyIncomePopulation * regData.avgDailyIncomeInUSD) / numOfDays);
  severeImpact.dollarsInFlight = Math.trunc((severeImpact.infectionsByRequestedTime
    * regData.avgDailyIncomePopulation * regData.avgDailyIncomeInUSD) / numOfDays);

  return {
    data,
    impact,
    severeImpact
  };
};

module.exports = covid19ImpactEstimator;

/* const Estimator = ({ data, factor }) => {
  // currently Infected
  const currentlyInfected = () => data.reportedCases * factor;

  const infectionsByRequestedTime = () => {
    // Get currently infected persons
    const personsInfected = currentlyInfected(factor);
    let powFactor;
    let numOfDays;

    // Determine the power factor by first reducing to days (if periodType is not in days)
    // Then divide by 3. For curretly infected persons doubles in 3 days
    if (data.periodType === 'days') {
      numOfDays = data.timeToElapse;
      powFactor = Math.trunc(data.timeToElapse / 3);
    } else
    if (data.periodType === 'weeks') {
      numOfDays = data.timeToElapse * 7;
      powFactor = Math.trunc(numOfDays / 3);
    } else
    if (data.periodType === 'months') {
      numOfDays = data.timeToElapse * 30;
      powFactor = Math.trunc(numOfDays / 3);
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
*/
