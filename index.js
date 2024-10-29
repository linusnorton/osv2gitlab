#!/bin/env node
const { convert } = require("./convert");

const main = async () => {
  const input = process.stdin.isTTY
    ? readFromFile()
    : await readFromPipe();

  const json = JSON.parse(input);

  console.log(JSON.stringify(convert(json), null, 2));
}

const readFromFile = () => {
  const fs = require('fs');
  const path = process.argv[2];

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