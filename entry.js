'use strict';

const rfr = require('rfr');

(async () => {
    await rfr('lib/config-wrapper').read();

    if(typeof global.config == 'undefined') {
        return;
    }

    var redisConnected = false;
    rfr('lib/redis');

    Redis.on('connected', () => {
        if(!redisConnected) {
            console.log('Connected to Redis');
            redisConnected = true;

            return rfr('server');
        }
    });

    setTimeout(function() {
        if(!redisConnected) {
            console.error('Connection timeout for Redis. Quitting..');

            global.Redis = false;

            setTimeout(() => process.exit(1), 150);
        }
    }, 5000);
})();
