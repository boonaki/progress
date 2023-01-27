const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const reelsController = require("../controllers/reels");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// router.get("/reelcreate", reelsController.reelCreate);
router.get("/getreel", reelsController.getReel)
router.post("/createreel", reelsController.createReel)
router.get("/view/:reelId", reelsController.viewReel)
router.delete("/deleteReel/:reelId", reelsController.deleteReel)
router.put("/likereel/:reelId/:user", reelsController.likeReel)

module.exports = router;