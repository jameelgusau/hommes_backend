module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    // console.log(err,"err")
    switch (true) {
        case typeof err === 'string':
            // custom application error
            const is404 = err.toLowerCase().endsWith('not found');
            const statusCode = is404 ? 404 : 400;
            return res.status(statusCode).json({meta:{message: err, status: statusCode }, data:{}});
        case err.name === 'UnauthorizedError':
            // jwt authentication error
            return res.status(401).json({meta:{message: 'Unauthorized', status: 401}, data:{} });
        default:
            return res.status(500).json({ meta:{status: 500, message: err.message}, data:{} });
    }
}