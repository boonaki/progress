const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, postsController.getPost);

router.put("/likePost/:id", postsController.likePost);

router.put("/addcaptureimage/:reelId", upload.single("file"), postsController.addCaptureImage)

router.put("/addcapturetext/:reelId", postsController.addCaptureText)

router.put("/addcapturelink/:reelId", postsController.addCaptureLink)

router.delete("/deletePost/:id", postsController.deletePost);

module.exports = router;
