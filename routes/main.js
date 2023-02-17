const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const reelsController = require("../controllers/reels");
const usersController = require("../controllers/users")
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", authController.getLogin);

router.get("/feed", ensureAuth, homeController.getFeed);
router.get('/search', homeController.getSearch)
router.get('/forgot', homeController.getForgotPass)

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
// router.get('/search/:id', usersController.getUserSearch)

module.exports = router;
