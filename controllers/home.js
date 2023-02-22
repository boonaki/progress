const Post = require("../models/Post");
const Reel = require("../models/Reel");
const User = require("../models/User");
const { ObjectId } = require("mongodb");
const crypto = require('crypto');

module.exports = {
    getIndex: (req, res) => {
        res.render("index.ejs");
    },
    getFeed: async (req, res) => {
        try {
            const requser = await User.find({_id: req.user._id})

            const searchRes = []
            
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

            const recentReels = await Reel.find({isPublic: {$ne: false}}).sort({createdAt: "desc"}).lean()

            const ruReels = await Reel.find({creator: req.user._id})
            // attempted writing a more optimized way of doing the above line
            // const ruReels = await Reel.find({creator: ObjectId(req.user._id)}, {projection: {_id: 0, title: 1, creator: 0, caption: 0, likes: 1, captures: 0, createdAt: 0, stars: 1}})

            // finds the average of all the likes for each post, stores into an object
            const rlAvg = await Reel.aggregate([{$group: {_id: null, average: {$avg: "$likes"}}}])

            //finds all reels with a likes count greater than the average likes count for all reels, and adds an offset.
            const popularReels = await Reel.find({likes: {$gte: Math.floor(rlAvg[0].average + 2)}, isPublic: {$ne: false}});

            res.render("feed.ejs", { 
                posts: followingPosts, 
                users: users, 
                requser: requser[0], 
                requserReels: ruReels,
                popularReels: popularReels,
                recentReels: recentReels,
                search: searchRes,
            });
        } catch (err) {
            console.log(err);
        }
    },
    getSearch: async (req,res) => {
        try{
            let searchQuery = req.query.s
            const results = await Reel.aggregate([
                {
                    '$search': {
                        'index': 'default', 
                        'text': {
                            'query': searchQuery, 
                            'path': 'title'
                        }
                    }
                },  {
                    '$project': {
                        'title': 1, 
                        'likes': 1, 
                        'stars': 1, 
                        '_id': 1,
                        'caption': 1, 
                        'userName': 1,
                        'isPublic': 1, 
                        'score': {
                            '$meta': 'searchScore'
                        },
                    }
                },  {
                    '$limit': 10
                    }
            ])
            res.send(results)
        }catch(err){
            req.session.returnTo = req.header('Referer') || '/'; 
            res.redirect(req.session.returnTo);
            delete req.session.returnTo;
        }
    },
    getForgotPass: (req,res) => {
        try{
            res.render('forgotpass.ejs');
        }catch(err){
            console.log(err)
        }
    },
    getReset: async (req,res) => {
        try{
            // const user = await User.findOne(u => (
            //     (u.resetPasswordExpires > Date.now()) &&
            //     crypto.timingSafeEqual(Buffer.from(u.resetPasswordToken), Buffer.from(req.params.token))
            // ));

            const user = await User.findOne({resetPasswordToken: req.params.token})
            if (!user) {
                req.flash('errors', {msg: 'Password reset token is invalid or has expired.'});
                return res.redirect('/forgot');
            }
            if(user.resetPasswordExpires < Date.now()){
                req.flash('errors', {msg: 'Password reset token is has expired.'})
                return res.redirect('/forgot')
            }

            res.render('passreset.ejs', {user: user, token: req.params.token})

        }catch(err){
            console.log(err)
            console.error(err)
        }
    },
};
