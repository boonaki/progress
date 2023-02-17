const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const reelsController = require("../controllers/reels");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// router.get("/reelcreate", reelsController.reelCreate);
router.get("/getreel", reelsController.getReel)
router.post("/createreel", reelsController.createReel)
router.get("/view/:reelId", reelsController.viewReel)
router.put("/delete/:reelId/:creator/:user", reelsController.deleteReel)
router.put("/likereel/:reelId/:user", reelsController.likeReel)
router.put("/givestar/:reelId/:user", reelsController.giveStar)
router.put("/unstar/:reelId/:user", reelsController.unstar)
router.get("/view/:reelId/edit/:user", reelsController.getEditReel)
router.put("/view/:reelId/edit/:user", reelsController.putEditReel)

module.exports = router;