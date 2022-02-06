const express = require("express");
const router = express.Router();
const cors = require("cors");

const options = {
    origin: "https://agostinhoramos.ddns.net",
    methods: "GET,POST",
    optionsSuccessStatus: 200
};

const noa_controller = require("../controllers/noa.controller")
router.get("/read/:_text", cors(options), noa_controller.read)
router.post("/write", cors(options), noa_controller.write)

router.get("/request_auth", cors(options), noa_controller.request_auth)
router.post("/auth", cors(options), noa_controller.auth)

module.exports = router;
