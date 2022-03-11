var express = require("express");
var router = express.Router();
const {isLoggedIn, isAdmin} = require("../controllers/auth")
const {addbookget, addbook, issuebook, findUser, issue, store, deleteFromStore, addStore, addStoreBook, updatePrice, updatePricePost, fzone, deleteFromFzone, addfzone, addZoneBook, deletefromlib, updateQuantity, updateQuantityPost,
    transaction, transactionUpdate,transactionUpdatePost
} = require("../controllers/admin");

router.get("/addbook", isLoggedIn, isAdmin, addbookget);
router.post("/addbook", isLoggedIn, isAdmin, addbook);
router.get("/issuebook/:bookid", isLoggedIn, isAdmin, issuebook);
router.post("/issuebook/findUser", isLoggedIn, isAdmin, findUser);
router.post("/issuebook/issue", isLoggedIn, isAdmin, issue);

router.get("/store", isLoggedIn, isAdmin, store);
router.get("/store/delete/:id", isLoggedIn, isAdmin, deleteFromStore);
router.get("/store/add", isLoggedIn, isAdmin, addStore);
router.post("/store/add", isLoggedIn, isAdmin, addStoreBook);
router.get("/store/update/:id/:old", isLoggedIn, isAdmin, updatePrice);
router.post("/store/update/:id/updatePrice", isLoggedIn, isAdmin, updatePricePost);

router.get("/fzone", isLoggedIn, isAdmin, fzone);
router.get("/fzone/delete/:id", isLoggedIn, isAdmin, deleteFromFzone);
router.get("/fzone/add", isLoggedIn, isAdmin, addfzone);
router.post("/fzone/add", isLoggedIn, isAdmin, addZoneBook);

router.get("/lib/delete/:id", isLoggedIn, isAdmin, deletefromlib);
router.get("/lib/update/:id/:ti/:tr/:avl", isLoggedIn, isAdmin, updateQuantity);
router.post("/lib/update/:id/:ti/:tr/updateQuantity", isLoggedIn, isAdmin, updateQuantityPost);

router.get("/transactions", isLoggedIn, isAdmin, transaction);
router.get("/transactions/:id", isLoggedIn, isAdmin, transactionUpdate);
router.post("/transactions/updateT", isLoggedIn, isAdmin, transactionUpdatePost);
module.exports = router;