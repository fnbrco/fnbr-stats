'use strict';

var rfr = require('rfr');
var EventEmitter = require('events');

class Redis extends EventEmitter {
    constructor() {
        super();

        var self = this;
        var IORedis = require('ioredis');
        this.instance = new IORedis(config.redis);

        this.instance.on('connect', function() {
            self.emit('connected');
        });
    }

    use() {
        return this.instance;
    }

    publish(channel, data) {
        if(typeof data == 'object') {
            data = JSON.stringify(data);
        }

        this.instance.publish(channel, data);
    }
}

global.Redis = new Redis();
