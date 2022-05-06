const express = require("express");
const router = express.Router();
const control  = require('../controllers/backdoor.controllers')

router.get("/backdoor", control.dropdoor);
module.exports = router;