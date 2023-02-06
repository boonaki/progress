const User = require("../models/User");
const Post = require("../models/Post");
const Reel = require("../models/Reel");
const Comment = require('../models/Comment');
const { ObjectId } = require("mongodb");

/*

button for action:
<form action="/dev/dothething?_method=PUT" method="POST">
    <button type="submit" class="px-4 border-2 text-[#ebebeb]">DO THE THING</button>
</form>

*/

module.exports = {
    doTheThing: async (req,res) => {
        try{
            // this code updated all of the likes value in each post from an array to an object
            // const filter = {}
            // updateDoc = {
            //     $set: {
            //         likes: {},
            //     }
            // }
            // await Post.updateMany(filter, updateDoc);

            // let posts = await Post.find()
            // for (let i = 0; i < posts.length; i++){
            //     console.log(i)
            //     await Reel.updateOne(
            //         {_id : ObjectId(posts[i].reel), "captures._id" : ObjectId(posts[i].id)},
            //         {$set: {"captures.$.likes": {}}},
            //         {upsert: true}
            //     )
            // }

            // **************************** //
            // this code updated all the reel likes to a number, and was also used to reset the stars array
            // await Reel.updateMany({}, {$set: {stars: []}}, {upsert: true})

            // **************************** //
            // this code updated the reels with the total count of their likes
            // let reels = await Reel.find()
            // let totalLikes = 0
            // for(let i = 0; i < reels.length; i++){
            //     for(let j = 0; j < reels[i].captures.length; j++){
            //         totalLikes += Object.keys(reels[i].captures[j].likes).length
            //     }
            //     await Reel.findOneAndUpdate({_id: ObjectId(reels[i].id)}, {$set: {likes: totalLikes}})
            //     totalLikes = 0;
            // }

            // **************************** //
            //this code updated the posts with their corresonding likes object length

            // let posts = await Post.find()

            // for(let i = 0; i < posts.length; i++){
            //     let count = Object.keys(posts[i].likes).length
            //     await Post.updateOne({_id: ObjectId(posts[i].id)}, {$set: {likesCount: count}}, {upsert: true})
            //     await Reel.updateOne(
            //         {_id: ObjectId(posts[i].reel), "captures._id" : ObjectId(posts[i].id)},
            //         {$set: { "captures.$.likesCount": count}},
            //         {upsert: true}
            //     )
            // }

            // **************************** //
            //this code will find all the reels tied to a specific user and update with a new property
            // const unchanged = await User.find()
            // const users = unchanged.map(e => e = `${e._id}`)

            // for(let i = 0; i < users.length; i++){
            //     console.log(unchanged[i].userName)
            //     await Reel.updateMany({creator: ObjectId(users[i])}, {$set: {userName: unchanged[i].userName}}, {upsert: true})
            // }
            
            // **************************** //

            req.session.returnTo = req.header('Referer') || '/'; 
            res.redirect(req.session.returnTo);
            delete req.session.returnTo;  
        }catch(err){
            console.log(err)
        }
    }
    
}