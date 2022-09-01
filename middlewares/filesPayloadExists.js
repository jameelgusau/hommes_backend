
const filesPayloadExists = (req, res, next) => {
    if(!req.files) return res.status(400).json({status: 400, message: 'Missing  Files'});
    next();
}

module.exports = filesPayloadExists;