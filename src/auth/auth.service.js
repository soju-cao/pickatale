'use strict';

var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var User = require('../api/user/user.model');
var config = require('../config/environment/index');
var compose = require('composable-middleware');
var validateJwt = expressJwt({ secret: config.secret });

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {

    return compose()
    // Validate jwt
    .use(function(req, res, next) {
        if(req.user) return next();
        // allow access_token to be passed through query parameter as well
        if(req.query && req.query.hasOwnProperty('access_token') || req.body && req.body.hasOwnProperty('access_token')) {
            req.headers.authorization = 'Bearer ' + req.query.access_token;
        }
        if (!req.headers.authorization) res.status(403).send('missing authorization header');
        if (req.headers.authorization) validateJwt(req, res, next);
    })
    // Attach user to request
    .use(function(req, res, next) {
        if(req.user.email) return next();
        console.log(req.user);
        User.findById(req.user._id, function (err, user) {
            if (err) return next(err);
            if (!user) return res.status(401).send('Unauthorized');

            req.user = user;
            next();
        });
    });

}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(payload) {
  return jwt.sign(payload, config.secret, { expiresIn: 60 * 60 * 5 });
}

exports.isAuthenticated = isAuthenticated;
exports.signToken = signToken;
