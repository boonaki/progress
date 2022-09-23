const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const reelsController = require("../controllers/reels");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// router.get("/reelcreate", reelsController.reelCreate);
router.get("/getreel", reelsController.getReel)
router.put("/addcapture/:reelId", upload.single("file"), reelsController.addCapture)
router.post("/createreel", reelsController.createReel)

module.exports = router;