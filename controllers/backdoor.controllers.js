const services = require("../services/backdoor.services");

module.exports = {
    dropdoor
}

 function dropdoor(req, res, next) {
    services.dropdoor()
    .then(() => res.json({ message: 'database dropped' }))
    .catch(next);
}