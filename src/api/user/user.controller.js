const User = require('./user.model');
const auth = require('../../auth/auth.service');
/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
    const data = req.body;
    const newUser = new User(data);
    newUser.save(function(err, user) {
        if (err) return next(err);
        user.token = auth.signToken({_id:user._id});
        const output = user.toJSON();

        res.status(201).json(output);
    });
};
/**
 * get user info
 */
exports.get = function (req, res, next) {
    User.find({_id: req.user._id})
        .exec(function (error, user) {
            res.status(200).json(user);
        });

};
