var express = require("express");
var router = express.Router();
const {isLoggedIn, isAdmin} = require("../controllers/auth")
const {view, profile, hold, update, order} = require("../controllers/user");

router.get("/view", isLoggedIn, view);
router.get("/profile", isLoggedIn, profile);
router.get("/hold/:bookid", isLoggedIn, hold);
router.post("/update", isLoggedIn, update);
router.get("/orders", isLoggedIn, order);

module.exports = router;