'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const crypto = require('crypto');

const UserSchema = new Schema({
    name: String,
    email: {type: String, lowercase: true},
    token: String

    // profile: {
    //     type: Schema.ObjectId,
    //     ref: 'parent'
    // }
});

UserSchema.plugin(timestamps);


module.exports = mongoose.model('User', UserSchema);
