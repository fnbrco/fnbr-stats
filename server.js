const rfr = require('rfr');

const fs = require('fs');
const restify = require('restify');
const async = require('async');

const bindServer = (server) => {
    server.use(restify.plugins.acceptParser(server.acceptable));
    server.use(restify.plugins.bodyParser());

    server.use((req, res, next) => {
        req.user_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        res.noCache();
        return next();
    });

    // Main ingest route, recieves requests from replica servers with item hits for period
    // Processing of the stats and permanent storage is done on main servers
    // Redis is a means of caching and temporary storage
    // The stats will be synced back to replicas via redis replication almost immediately
    server.put('/emit', (req, res, next) => {
        // Ensure the requester has an auth token
        if(config.putKey.indexOf(req.header('x-auth-token', '')) >= 0) {
            if(!req.body.itemHits) {
                return res.send(400, {status: 400, error: 'Bad Request', message: 'Malford JSON, missing required parameters'});
            }

            // Loop through the data
            async.forEachOf(req.body.itemHits, (hits, item, next) => {
                // Increment the sorted set (might change this to a pipeline)
                Redis.use().zincrby('popular_items', hits, item).then(next);
            }, function() {
                return res.json({status: 200});
            });
        } else {
            // Return an error for wrong or no token provided
            return res.send(401, {status: 401, error: 'Unauthorized', message: 'You do not have access to this service.'});
        }
    });
};

if(config.ssl) {
    const constants = require('constants');
    const https_options = {
        secureOptions: constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_SSLv2,
        key: fs.readFileSync(config.ssl.directory + '/privkey.pem'),
        certificate: fs.readFileSync(config.ssl.directory + '/fullchain.pem'),
        ca: fs.readFileSync(config.ssl.directory + '/chain.pem')
    };

    const httpsServer = restify.createServer(https_options);
    bindServer(httpsServer);

    httpsServer.listen(config.ssl.port, () => {
        console.log('Service started with HTTPS at ' + httpsServer.url + ' [' + config.env + ']');
    });
} else {
    const httpServer = restify.createServer();
    bindServer(httpServer);

    httpServer.listen(config.port, () => {
        console.log('Service started at ' + httpServer.url + ' [' + config.env + ']');
    });
}
