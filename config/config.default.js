var config = {};
var path = require('path');

config.port = process.env.PORT || 5000;
config.putKey = ['']; // Authentication for PUT requests
config.ssl = {
    directory: path.join(process.cwd(), 'ssl'),
    port: process.env.SSL_PORT || 443
};

config.redis = {
    password: '',
    host: 'localhost',
    port: 6379,
    db: 0
};

module.exports = config;
