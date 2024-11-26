const { mapSeverity } = require("./convert");

const SEVERITY_LEVELS = {
  "Critical": 5,
  "High": 4,
  "Medium": 3,
  "Low": 2,
  "Unknown": 1
};

const createSeverityFilter = (severity) => {
  const minSeverityLevel = SEVERITY_LEVELS[mapSeverity(severity)];

  if (!minSeverityLevel) {
    throw new Error(`Unknown severity level ${severity}`);
  }

  return (input) => {
    return {
      ...input,
      results: input.results?.map(r => filterSeverityFromResults(r, minSeverityLevel)).filter(result => result !== null)
    };
  };
}

const filterSeverityFromResults = (input, minSeverityLevel) => {
  const packages = input.packages?.map(pack => filterSeverityFromPackages(pack, minSeverityLevel)).filter(pack => pack !== null) || [];

  return packages.length > 0 ? { ...input, packages } : null;
}

const filterSeverityFromPackages = (pack, minSeverityLevel) => {
  const vulnerabilities = pack?.vulnerabilities.filter(vulnerability => filterSeverityFromVulnerability(vulnerability, minSeverityLevel)) || [];

  return vulnerabilities.length > 0 ? { ...pack, vulnerabilities } : null;
}

const filterSeverityFromVulnerability = (vulnerability, minSeverityLevel) => {
  const severity = mapSeverity(vulnerability?.database_specific?.severity || "Unknown");
  const severityLevel = SEVERITY_LEVELS[severity];

  return severityLevel >= minSeverityLevel;
}

module.exports = { createSeverityFilter }