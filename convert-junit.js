const {mapSeverity} = require("./convert");
const xmlEscape = require('xml-escape');

const convertJunit = (input) => {
  const testSuites = input.results?.flatMap(convertResults) || [];
  const num = testSuites.length;

  return `<?xml version="1.0" ?>
<testsuites disabled="0" errors="0" failures="${num}" tests="${num}" time="0.0">
  ${testSuites.join("\n")}
</testsuites>
`;
}

const convertResults = (input) => {
  return input.packages?.flatMap(pack => pack.vulnerabilities.map(vulnerability => {
    const severity = mapSeverity(vulnerability?.database_specific?.severity || "Unknown");
    const summary = xmlEscape(vulnerability.summary);
    return `
<testcase name="[${severity}][${vulnerability.id}][${pack["package"].name}] ${summary}" file="${input.source.path}" classname="${pack["package"].name}">
  <failure type="failure" message="${summary}"><![CDATA[${severity}][${vulnerability.id}][${pack["package"].name}] ${vulnerability.summary}\n${(vulnerability.details)}]]></failure>
</testcase>
`;
  }));
}

module.exports = { convertJunit }