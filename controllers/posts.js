const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Reel = require("../models/Reel");
const User = require("../models/User");
const Comment = require('../models/Comment')
const linkPreviewGenerator = require("link-preview-generator");
const { ObjectId } = require("mongodb");
const { post } = require("../routes/main");

module.exports = {
    getFeed: async (req, res) => {
        try {
            const users = await User.find()
            const posts = await Post.find().sort({ createdAt: "desc" }).lean();
            const requser = await User.find({_id: req.user._id})
            const ruReels = await Reel.find({creator: req.user._id})
            res.render("feed.ejs", { posts: posts, users: users, requser: requser[0], ruReels: ruReels });
        } catch (err) {
            console.log(err);
        }
    },

    getPost: async (req, res) => {
        try {
            const comments = await Comment.find({postId: req.params.id})
            const post = await Post.findById(req.params.id);
            const user = await User.find({userName: post.userName})
            res.render("post.ejs", { cap: post, user: user[0], comments: comments, requser: req.user });
        } catch (err) {
            console.log(err);
        }
    },

    createCapturePage: async (req, res) => {
        try {
            const user = await User.find({ _id: req.user.id })
            let reel = await Reel.find({_id: req.params.reelId})
            res.render("createcapture.ejs", { reel: reel, user: user[0] })
        } catch (err) {
            console.log(err)
        }
    },
    addCaptureImage: async (req, res) => {
        try {
            //Upload image to cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);

            let today = new Date();
            let DD = String(today.getDate()).padStart(2, '0');
            let MM = String(today.getMonth() + 1).padStart(2, '0');
            let YYYY = today.getFullYear();
            today = YYYY + '/' + MM + '/' + DD;

            let post = await Post.create({
                title: req.body.title,
                imageLink: result.secure_url,
                cloudinaryId: result.public_id,
                caption: req.body.caption,
                type: 'image',
                reelName: req.params.reelName,
                userName: req.user.userName,
                reel: req.params.reelId,
                date: today
            })

            await Reel.findOneAndUpdate(
                { _id: req.params.reelId },
                { $push: { captures: post } },
                { upsert: true }
            )
            console.log('updated and added maybe')
            res.redirect('/u/'+req.user.userName)
        } catch (err) {
            console.log(err)
        }
    },
    addCaptureText: async (req, res) => {
        try{
            let today = new Date();
            let DD = String(today.getDate()).padStart(2, '0');
            let MM = String(today.getMonth() + 1).padStart(2, '0');
            let YYYY = today.getFullYear();
            today = YYYY + '/' + MM + '/' + DD;
            let post = await Post.create({
                title: req.body.titleText,
                description: req.body.description,
                userName: req.user.userName,
                type: 'text',
                reelName: req.params.reelName,
                caption: 'NA',
                reel: req.params.reelId,
                date: today
            })
            await Reel.findOneAndUpdate(
                { _id: `${req.params.reelId}`},
                { $push: {captures: post}},
                { upsert: true}
            )
            res.redirect('/u/'+req.user.userName)
        }catch(err){
            console.log(err)
        }
    },
    addCaptureLink: async (req, res) => {
        try{
            let today = new Date();
            let DD = String(today.getDate()).padStart(2, '0');
            let MM = String(today.getMonth() + 1).padStart(2, '0');
            let YYYY = today.getFullYear();
            today = YYYY + '/' + MM + '/' + DD;

            const previewData = await linkPreviewGenerator(req.body.link);

            let post = await Post.create({
                title: req.body.titleLink,
                caption: req.body.caption,
                userName: req.user.userName,
                extLink: req.body.link,
                extLinkInfo: previewData,
                reelName: req.params.reelName,
                type: 'link',
                reel: req.params.reelId,
                date: today
            })
            await Reel.findOneAndUpdate(
                { _id: req.params.reelId },
                { $push: {captures: post}},
                { upsert: true}
            )
            res.redirect('/u/'+req.user.userName)
        }catch(err){
            console.log(err)
        }
    },
    likePostViewReel: async (req, res) => {
        try {
            let post = await Post.find({_id: req.params.id})
            // console.log(post)
            if(!post[0].likes.includes(req.user.id)){
                await Post.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        $push: { likes : req.user.id },
                    }
                );
                await Reel.findOneAndUpdate(
                    {_id : req.params.reelId, "captures._id" : ObjectId(req.params.id)},
                    {$push: {"captures.$.likes": req.user.id}}
                )
            }else{
                res.redirect(`/reel/viewreel/${req.params.reelId}`);
            }
            
            console.log("like +1")
            res.redirect(`/reel/viewreel/${req.params.reelId}`);
        } catch (err) {
            console.log(err);
        }
    },
    deletePost: async (req, res) => {
        try {
            
            // // Delete image from cloudinary
            if(req.params.type == 'image'){
                // Find post by id
                let post = await Post.findById({ _id: req.params.id });
                await cloudinary.uploader.destroy(post.cloudinaryId);
            }
            // Delete post from db
            await Reel.findOneAndUpdate(
                {_id : req.params.reelId},
                {$pull: {"captures" : {_id: ObjectId(req.params.id)}}}
            )
            await Post.deleteOne({ _id: req.params.id });
            console.log("Deleted Post");
            res.redirect("/reel/viewreel/"+req.params.reelId);
        } catch (err) {
            console.error(err)
            res.redirect('/u/'+req.user.userName);
        }
    },
};
