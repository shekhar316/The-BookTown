var express = require("express");
var router = express.Router();
const {isLoggedIn} = require("../controllers/auth")
const {viewbooks, viewbookbyid} = require("../controllers/book");

router.get("/view", viewbooks);

router.get('/viewbyid/:id', isLoggedIn, viewbookbyid)

module.exports = router;