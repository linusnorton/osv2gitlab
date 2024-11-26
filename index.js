#!/bin/env node
const { convert } = require("./convert");
const { createSeverityFilter } = require("./filter");
const { convertJunit } = require("./convert-junit");

const main = async () => {
  const input = process.stdin.isTTY
    ? readFromFile()
    : await readFromPipe();

  const converterFn = getArg("--format") === "junit" ? convertJunit : convert;
  const filter = getArg("--threshold") !== null ? createSeverityFilter(getArg("--threshold")) : n => n;
  const json = JSON.parse(input);
  const filteredResults = filter(json);

  console.log(converterFn(filteredResults));
}

const getArg = (name) => {
  const index = process.argv.findIndex(arg => arg.startsWith(name));

  if (index === -1) {
    return null;
  } else if (process.argv[index].indexOf("=") !== -1) {
    return process.argv[index].split("=")[1];
  } else if (process.argv.length > index + 1) {
    return process.argv[index + 1];
  } else {
    return null;
  }
}

const readFromFile = () => {
  const fs = require('fs');
  const path = process.argv[process.argv.length - 1];

  if (!fs.existsSync(path)) {
    throw new Error(`File not found: ${path}`);
  }

  return fs.readFileSync(path, 'utf8');
}

const readFromPipe = async () => {
  let data = '';
  for await (const chunk of process.stdin) {
    data += chunk;
  }
  return data;
}

main().catch(console.error);