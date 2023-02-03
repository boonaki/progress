const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Reel = require("../models/Reel");
const User = require("../models/User");
const Comment = require('../models/Comment');
const { ObjectId } = require("mongodb");
const { post } = require("../routes/main");
const fetch = require('node-fetch')

module.exports = {
    getFeed: async (req, res) => {
        try {
            const requser = await User.find({_id: req.user._id})
            
            const following = requser[0].following

            // added all posts that have been made by people who the req user follows
            // done to remove the use of includes during render
            // could possibly use the aggregate method given more time.
            let followingPosts = []

            for(let i = 0; i < following.length; i++){
                let postsToPush =  await Post.find({"userId": ObjectId(following[i])});
                followingPosts = [...followingPosts, ...postsToPush];
            }

            followingPosts.sort((a,b) => b.createdAt - a.createdAt);

            const users = await User.find()

            const recentReels = await Reel.find().sort({createdAt: "desc"}).lean()

            const allUserRecents = await Post.find().sort({createdAt: "desc"}).lean()

            const ruReels = await Reel.find({creator: req.user._id})
            // attempted writing a more optimized way of doing the above line
            // const ruReels = await Reel.find({creator: ObjectId(req.user._id)}, {projection: {_id: 0, title: 1, creator: 0, caption: 0, likes: 1, captures: 0, createdAt: 0, stars: 1}})

            // finds the average of all the likes for each post, stores into an object
            const rlAvg = await Reel.aggregate([{$group: {_id: null, average: {$avg: "$likes"}}}])

            //finds all reels with a likes count greater than the average likes count for all reels, and adds an offset.
            const popularReels = await Reel.find({likes: {$gte: Math.floor(rlAvg[0].average + 2)}});

            res.render("feed.ejs", { 
                posts: followingPosts, 
                users: users, 
                requser: requser[0], 
                requserReels: ruReels,
                popularReels: popularReels,
                recentReels: recentReels,
                allUserRecents: allUserRecents,
            });
        } catch (err) {
            console.log(err);
        }
    },
    getPost: async (req, res) => {
        try {
            const comments = await Comment.find({postId: req.params.id})
            const post = await Post.findById(req.params.id);
            const reel = await Reel.findById(post.reel);
            const user = await User.find({userName: post.userName})
            res.render("post.ejs", { cap: post, user: user[0], comments: comments, requser: req.user, reelcaption: reel.caption });
        } catch (err) {
            console.log(err);
        }
    },
    getEditPost: async (req, res) => {
        try{
            const post = await Post.findById(req.params.id)
            if(post.userName === req.user.userName){
                const user = req.user
                res.render("editpost.ejs", {cap: post, user: user, requser: req.user})
            }else{
                req.flash('info', 'Not Valid')
                res.redirect('/');
            }

        }catch(err){
            res.redirect('/feed')
        }
    },

    createCapturePage: async (req, res) => {
        try {
            const user = await User.find({ _id: req.user.id })
            let reel = await Reel.find({_id: req.params.reelId})
            res.render("createcapture.ejs", { reel: reel[0], requser: user[0] })
        } catch (err) {
            req.flash('info', 'Something went wrong...')
            res.redirect('/reel/viewreel/'+req.params.reelId)
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
                userId: req.user.id,
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
            req.flash("info", 'Something went wrong...')
            res.redirect('/u/'+req.user.userName)
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
                userId: req.user.id,
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
            req.flash("info", 'Something went wrong...')
            res.redirect('/u/'+req.user.userName)
        }
    },
    addCaptureLink: async (req, res) => {
        try{
            let today = new Date();
            let DD = String(today.getDate()).padStart(2, '0');
            let MM = String(today.getMonth() + 1).padStart(2, '0');
            let YYYY = today.getFullYear();
            today = YYYY + '/' + MM + '/' + DD;

            const url = `http://api.linkpreview.net/?key=${process.env.LPG_API}&q=${req.body.link}`
            const data = await fetch(url);
            const previewData = await data.json();

            if(previewData.error === 423){
                previewData.description = 'Access to this website is blocked.'
            }

            if(previewData.image === "") {
                previewData.image = 'https://res.cloudinary.com/dbrsr8xju/image/upload/v1675353744/placeholder_rqwql2.png'
            }

            let post = await Post.create({
                title: req.body.titleLink,
                caption: req.body.caption,
                userName: req.user.userName,
                userId: req.user.id,
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
            req.flash("info", 'Something went wrong...')
            res.redirect('/u/'+req.user.userName)
        }
    },

    likePost: async (req, res) => {
        try {
            let post = await Post.find({_id: req.params.id})
            const userId = req.user.id

            var t = userId
            var field_name = "likes." + t
            var update = { "$set" : { } }
            update["$set"][field_name] = true;

            var field_name2 = "captures.$.likes." + t
            var update2 = { "$set" : { } }
            update2["$set"][field_name2] = true;

            if(post[0].likes[userId] === undefined){
                await Post.findOneAndUpdate({ _id: ObjectId(req.params.id) }, update);
                await Post.findOneAndUpdate({ _id: ObjectId(req.params.id) }, {$inc: {likesCount: 1}});
                await Reel.findOneAndUpdate(
                    {_id : ObjectId(req.params.reelId), "captures._id" : ObjectId(req.params.id)},
                    update2
                )
                await Reel.findOneAndUpdate({_id: ObjectId(req.params.reelId)}, {$inc: {likes: 1}})
            }
            
            req.session.returnTo = req.header('Referer') || '/'; 
            res.redirect(req.session.returnTo);
            delete req.session.returnTo;  
        } catch (err) {
            req.flash("info", {msg: 'Unable to like post due to an error, please try again'})
            res.redirect('/u/'+req.user.userName)
        }
    },

    unlikePost: async (req,res) => {
        try{
            let post = await Post.find({_id: req.params.id})
            const userId = req.user.id

            var t = userId
            var field_name = "likes." + t
            var update = { "$unset" : { } }
            update["$unset"][field_name] = false;

            var field_name2 = "captures.$.likes." + t
            var update2 = { "$unset" : { } }
            update2["$unset"][field_name2] = false;

            if(post[0].likes[userId]){
                await Post.findOneAndUpdate({_id: ObjectId(post[0].id)}, update)
                await Post.findOneAndUpdate({ _id: ObjectId(post[0].id) }, {$inc: {likesCount: -1}});
                await Reel.findOneAndUpdate({_id : ObjectId(req.params.reelId), "captures._id" : ObjectId(req.params.id)}, update2)
                await Reel.findOneAndUpdate({_id: ObjectId(req.params.reelId)}, {$inc: {likes: -1}})
            }

            req.session.returnTo = req.header('Referer') || '/'; 
            res.redirect(req.session.returnTo);
            delete req.session.returnTo;  
        }catch(err) {
            console.log(err)
            console.error(err)
            req.flash("info", {msg: 'Unable to like post due to an error, please try again.'})
            res.redirect('/u/'+req.user.userName)
        }
    },

    editPost: async (req, res) => {
        try{

            if (req.body?.title === '') {
                req.flash("info", {msg: "Please enter a title"})
                req.session.returnTo = req.header('Referer') || '/'; 
                res.redirect(req.session.returnTo);
                delete req.session.returnTo;  
            }


            await Post.findOneAndUpdate(
                {_id: req.params.id},
                {$set: {
                    title: req.body.title,
                    caption: req.body?.caption || "",
                    description: req.body?.description || "",
                }},
            )

            await Reel.findOneAndUpdate(
                {_id: req.params.reelId, "captures._id" : ObjectId(req.params.id)},
                {$set: 
                    {
                        "captures.$.title": req.body.title,
                        "captures.$.description": req.body?.description || "",
                        "captures.$.caption": req.body?.caption || "",
                    }
                }
            )



            // if(req.params.type === 'link'){
            //     if(req.body.link !== req.body.caplink){
            //         const url = `http://api.linkpreview.net/?key=${process.env.LPG_API}&q=${req.body.link}`
            //         const data = await fetch(url);
            //         const previewData = await data.json()
                    




            //         await Post.findOneAndUpdate(
            //             {_id: req.params.id},
            //             {$set:
            //                 {
            //                     title: req.body.title,
            //                     extLink: req.body.link,
            //                     caption: req.body.caption,
            //                     extLinkInfo: previewData,
            //                 }
            //             }
            //         )
            //         await Reel.findOneAndUpdate(
            //             {_id: req.params.reelId, "captures._id" : ObjectId(req.params.id)},
            //             {$set: 
            //                 {
            //                     "captures.$.title": req.body.title,
            //                     "captures.$.extLink": req.body.link,
            //                     "captures.$.caption": req.body.caption,
            //                     "captures.$.extLinkInfo": previewData,
            //                 }
            //             }
            //         )
            //     }else{
            //         await Post.findOneAndUpdate(
            //             {_id: req.params.id},
            //             {$set:
            //                 {
            //                     title: req.body.title,
            //                     caption: req.body.caption,                               
            //                 }
            //             }
            //         )
            //         await Reel.findOneAndUpdate(
            //             {_id: req.params.reelId, "captures._id" : ObjectId(req.params.id)},
            //             {$set: 
            //                 {
            //                     "captures.$.title": req.body.title,
            //                     "captures.$.caption": req.body.caption,
            //                 }
            //             }
            //         )
            //     }
            // }else if(req.params.type === 'text'){
            //     await Post.findOneAndUpdate(
            //         {_id: req.params.id},
            //         {$set:
            //             {
            //                 title: req.body.title,
            //                 description: req.body.description,
            //                 caption: req.body.caption,                               
            //             }
            //         }
            //     )
            //     await Reel.findOneAndUpdate(
            //         {_id: req.params.reelId, "captures._id" : ObjectId(req.params.id)},
            //         {$set: 
            //             {
            //                 "captures.$.title": req.body.title,
            //                 "captures.$.description": req.body.description,
            //                 "captures.$.caption": req.body.caption,
            //             }
            //         }
            //     )
            // }else if(req.params.type === 'image'){
            //     await Post.findOneAndUpdate(
            //         {_id: req.params.id},
            //         {$set:
            //             {
            //                 title: req.body.title,
            //                 caption: req.body.caption,                               
            //             }
            //         }
            //     )
            //     await Reel.findOneAndUpdate(
            //         {_id: req.params.reelId, "captures._id" : ObjectId(req.params.id)},
            //         {$set: 
            //             {
            //                 "captures.$.title": req.body.title,
            //                 "captures.$.caption": req.body.caption,
            //             }
            //         }
            //     )
            // }

            res.redirect("/post/"+req.params.id)
        }catch(err){
            console.log(err)
        }
    },

    deletePost: async (req, res) => {
        try {
            // Delete image from cloudinary
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
            res.redirect("/reel/view/"+req.params.reelId);
        } catch (err) {
            console.error(err)
            //return user back to their profile page
            res.redirect('/u/'+req.user.userName);
        }
    },

};
