var express = require("express");
var router = express.Router();
const {isLoggedIn} = require("../controllers/auth")
const {viewPbooks, viewPbookbyid, buy, save, sendbook} = require("../controllers/store");

router.get("/view", viewPbooks);

router.get('/viewbyid/:id', isLoggedIn, viewPbookbyid)
router.get('/buy/:id', isLoggedIn, buy)
router.post('/save/:id/:amount/:receipt', isLoggedIn, save)
router.get('/sendbook/:id', isLoggedIn, sendbook)


module.exports = router;