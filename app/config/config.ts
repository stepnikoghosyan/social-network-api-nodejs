import {readFileSync} from 'fs';
const environment = process.env.NODE_ENV || 'development';

console.log('Environment:', environment);

const defaultConfig = JSON.parse(`${readFileSync(`${__dirname}/default.json`)}`);
const rawData = readFileSync(`${__dirname}/${environment}.json`);
const config = {
  ...defaultConfig,
  ...JSON.parse(`${rawData}`)
};

export default {
  get: (key: string) => {
    if (environment === 'production') {
      return process.env[config[key]] || '';
    }
    return config[key];
  }
};
