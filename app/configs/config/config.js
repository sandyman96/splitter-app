const _ = require('lodash');
const env = process.env.NODE_ENV || 'local';
const envConfig = require('./' + env); //either local or NODE_ENV
let defaultenvConfig = {
    env: env    //further details will be merged below
};

module.exports = _.merge(defaultenvConfig, envConfig);