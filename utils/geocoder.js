const nodeGeocoder = require('node-geocoder');

const optioons = {
    provider: process.env.GEOCODER_PROVIDER,
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_KEY,
    formatter: null
};

const geocoder = nodeGeocoder(optioons);

module.exports = geocoder;