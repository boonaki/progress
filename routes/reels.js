const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const reelsController = require("../controllers/reels");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// router.get("/reelcreate", reelsController.reelCreate);
router.get("/getreel", reelsController.getReel)
router.post("/createreel", reelsController.createReel)
router.get("/viewreel/:reelId", reelsController.viewReel)

module.exports = router;