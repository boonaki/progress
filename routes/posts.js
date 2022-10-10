const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, postsController.getPost);

router.put("/likePost/:reelId/:id", postsController.likePostViewReel);

router.put("/:reelName/addcaptureimage/:reelId", upload.single("file"), postsController.addCaptureImage)

router.put("/:reelName/addcapturetext/:reelId", postsController.addCaptureText)

router.put("/:reelName/addcapturelink/:reelId", postsController.addCaptureLink)

router.put("/deletePost/:reelId/:id/:type", postsController.deletePost);

router.put("/:id/editpost/:type/:reelId", postsController.editPost)

module.exports = router;
