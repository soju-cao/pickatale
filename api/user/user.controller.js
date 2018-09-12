const User = require('./user.model');

const validationError = function(res, err) {
    return res.status(500).json(err);
};
/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
    const data = req.body;
    const newUser = new User(data);
    newUser.save(function(err, user) {
        if (err) return validationError(res, err);

        const output = user.toJSON();

        res.status(201).json(output);
    });
};
