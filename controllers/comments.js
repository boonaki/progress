const Comment = require("../models/Comment");
const User = require("../models/User");

module.exports = {
    createComment: async (req, res) => {
        try {
            //finds username of commenter
            let commentUser = await User.findById(req.user.id)
            await Comment.create({
                //for the comment itself
                text: req.body.comment,
                //the username of the requesting user, grabbed from User model schema
                commenterName: commentUser.userName,
                //assigns userid to requesting user id
                commenterId: req.user.id,
                //links comment to post, grabbed from url
                postId: req.params.postId
            });
            console.log("Comment has been added!");
            res.redirect("/post/"+req.params.postId);
        } catch (err) {
            console.log(err);
        }
    },
    deleteComment: async (req, res) => {
        try {
            // Find comment by id, and deletes
            await Comment.deleteOne({ _id: req.params.commentid });
            console.log("Deleted Comment");
            res.redirect("/post/"+req.params.postid);
        } catch (err) {
            console.log(err)
        }
    },
    likeComment: async (req,res) => {
        try{
            let comment = await Comment.find({_id: req.params.id})
            if(!comment[0].likes.includes(req.user.id)){
                await Comment.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        $push: { likes : req.user.id },
                    }
                );
            }
            req.session.returnTo = req.header('Referer') || '/'; 
            res.redirect(req.session.returnTo);
            delete req.session.returnTo;  
        } catch (err) {
            console.log(err)
        }
    }
};