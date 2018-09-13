'use strict';

var _ = require('lodash');

const config = {
    // Server port
    port: process.env.PORT || 8082,

    // Server IP
    ip: process.env.IP || 'localhost',
    // MongoDB connection options
    mongo: {
        options: {
            db: {
                safe: true
            }
        }
    },
    secret: 'pickatale-secret'
};




// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
    config,
    require('./' + process.env.NODE_ENV + '.js') || {}
);
