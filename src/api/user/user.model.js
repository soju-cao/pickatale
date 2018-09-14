'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const crypto = require('crypto');

const UserSchema = new Schema({
    name: String,
    email: {
        type: String,
        lowercase: true
    },
    token: String

    // profile: {
    //     type: Schema.ObjectId,
    //     ref: 'parent'
    // }
});

/**
 * Virtuals
 */
UserSchema
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

/**
 * Validations
 */

// Validate empty email
UserSchema
    .path('email')
    .validate(function (email) {
        return email.length;
    }, 'Email cannot be blank');

// Validate empty password
// UserSchema
//     .path('hashedPassword')
//     .validate(function (hashedPassword) {
//         return hashedPassword.length;
//     }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
    .path('email')
    .validate(function (value, respond) {
        var self = this;
        this.constructor.findOne({email: value}, function (err, user) {
            if (err) throw err;
            if (user) {
                if (self.id === user.id) return respond(true);
                return respond(false);
            }
            respond(true);
        });
    }, 'The specified email address is already in use.');

UserSchema.plugin(timestamps);

/**
 * Methods
 */
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function () {
        return crypto.randomBytes(16).toString('base64');
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function (password) {
        if (!password || !this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        var passwd = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64');
        return passwd;
    }
};

module.exports = mongoose.model('User', UserSchema);
