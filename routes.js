'use strict';

module.exports = function(app) {
    app.use('/api/user',  require('./src/api/user'));
};
