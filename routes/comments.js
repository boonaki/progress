const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const commentController = require("../controllers/comments");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Comment Routes - simplified for now endpoint is '/c'

//sends control to controller based on the given id
router.post("/createComment/:postId", commentController.createComment);

router.delete("/deleteComment/:postId/:commentid", commentController.deleteComment);

router.put("/like/:id", commentController.likeComment);

module.exports = router;