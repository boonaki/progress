const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, postsController.getPost);

router.put("/likePost/:reelId/:id", postsController.likePostViewReel);

router.put("/addcaptureimage/:reelId", upload.single("file"), postsController.addCaptureImage)

router.put("/addcapturetext/:reelId", postsController.addCaptureText)

router.put("/addcapturelink/:reelId", postsController.addCaptureLink)

router.put("/deletePost/:reelId/:id/:type", postsController.deletePost);

module.exports = router;
