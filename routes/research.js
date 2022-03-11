var express = require("express");
var router = express.Router();
const {isLoggedIn, isAdmin} = require("../controllers/auth")
const {view, scholar, doi, doiDown, sch} = require("../controllers/research");

router.get("/view", isLoggedIn, view);
router.get("/scholar", isLoggedIn, scholar);
router.get("/doi", isLoggedIn, doi);
router.post("/doi", isLoggedIn, doiDown);
router.post("/scholar", isLoggedIn, sch);

module.exports = router;