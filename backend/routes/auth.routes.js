const express = require("express");
const router = express.Router();
const { login, register, getMe } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/login", login);


module.exports = router;
