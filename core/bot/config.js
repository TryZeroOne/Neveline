const yaml = require('js-yaml');
const fs = require('fs');

const fileContents = fs.readFileSync('../../config.yml', 'utf8');
const config = yaml.load(fileContents);

module.exports = config;
