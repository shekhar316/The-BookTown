var express = require("express");
var router = express.Router();
const {isLoggedIn} = require("../controllers/auth")
const {viewEbooks, viewEbookbyid, getebook} = require("../controllers/ebook");

router.get("/view", viewEbooks);

router.get('/viewbyid/:id', isLoggedIn, viewEbookbyid)

router.get('/getebook/:id',isLoggedIn, getebook)

module.exports = router;