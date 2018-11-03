var rfr = require('rfr');

module.exports.read = function() {
    return new Promise((resolve, reject) => {
        try {
            global.config = require(process.cwd() + '/config/config.js');

            setTimeout(function() { resolve(config); } , 300);
        } catch(ex) {
            if(ex.code == 'MODULE_NOT_FOUND') {
                /* eslint-disable */
                console.error(' ');
                console.error('No config.js file found. For defaults see config/config.default.js');
                console.error(' ');
                console.trace(ex.message);
                /* eslint-enable */
                return setTimeout(() => process.exit(1), 150);
            }

            console.error('Unable to read config.js - ' + ex.code);

            throw ex;
        }
    });
};
