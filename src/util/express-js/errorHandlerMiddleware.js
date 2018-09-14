const errorHandlerMiddleware = (err, req, res, next) => {
    console.log('err handing');
    console.log(err);
    if (!err) return next();

    // todo handle error
    const {message, name, status} = err;
    if(name === 'UnauthorizedError') {
        res.status(status || 401).json(message || err);
    }

    res.status(500).json(message || err);
};

module.exports = errorHandlerMiddleware;
