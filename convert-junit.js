const {mapSeverity} = require("./convert");

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

    return `
<testcase name="[${severity}][${vulnerability.id}][${pack["package"].name}] ${vulnerability.summary}" file="${input.source.path}" classname="${pack["package"].name}">
  <failure type="failure" message="${vulnerability.summary}"><![CDATA[${severity}][${vulnerability.id}][${pack["package"].name}] ${vulnerability.summary}\n${vulnerability.details}]]></failure>
</testcase>
`;
  }));
}

module.exports = { convertJunit }