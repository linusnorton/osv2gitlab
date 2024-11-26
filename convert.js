const convert = (input) => {
  const vulnerabilities = input.results?.flatMap(convertVulnerabilities) || [];

  return JSON.stringify({
    version: "15.2.1",
    schema: "https://gitlab.com/gitlab-org/security-products/security-report-schemas/-/raw/v15.0.6/dist/dependency-scanning-report-format.json?ref_type=tags",
    scan: {
      scanner: {
        id: "osv-scanner",
        name: "OSV Scanner",
        version: "1.9.0",
        vendor: {
          name: "Google"
        },
        url: "https://www.osv.dev/",
      },
      analyzer: {
        id: "osv2gitlab",
        name: "osv2gitlab",
        version: "1.0.0",
        vendor: {
          name: "Linus Norton"
        },
        url: "https://www.github.com/linusnorton/osv2gitlab/",
      },
      start_time: new Date().toISOString().substring(0, 19),
      end_time: new Date().toISOString().substring(0, 19),
      status: vulnerabilities.length === 0 ? "success" : "failure",
      type: "dependency_scanning",
    },
    vulnerabilities
  }, null, 2);
}

const convertVulnerabilities = (input) => {
  return input.packages?.flatMap(pack => pack.vulnerabilities.map(vulnerability => ({
    id: vulnerability.id,
    identifiers: [
      {
        type: "osvdb",
        name: vulnerability.summary,
        value: vulnerability.id,
      },
      ...vulnerability.aliases.map(alias => ({
        type: "osvdb",
        name: vulnerability.summary,
        value: alias,
      }))
    ],
    location: {
      file: input.source.path,
      dependency: {
        package: {
          name: pack["package"].name,
        },
        version: pack["package"].version,
      }
    },
    name: vulnerability.summary,
    description: vulnerability.details,
    severity: mapSeverity(vulnerability?.database_specific?.severity || "Unknown"),
    links: vulnerability.references.map(reference => ({
      url: reference.url,
    })),
  })));
}

const mapSeverity = (string) => {
  const formatted = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

  return formatted === "Moderate" ? "Medium" : formatted;
}

module.exports = { convert, mapSeverity };
