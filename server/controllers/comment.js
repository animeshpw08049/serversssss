const { Comment } = require("../models/Comment.js");
const {Post} = require("../models/Post.js")
const { User } = require("../models/User.js");


async function getCommentsByPostId(postId) {
    const comments = await Comment.find({
        'post._id': postId
    }).sort({
        createdAt: -1,
    })

    return comments;
}


async function addComment(userId, postId, commentData) {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error('User does not exist')
    }

    const post = await Post.findById(postId);

    if (!post) {
        throw new Error('Post does not exist')
    }

    const comment = await Comment.create({
        ...commentData,
        author: {
            _id: user._id,
            name: user.name,
            image: user.image
        },
        post: {
            _id: post._id,
            title: post.title
        }
    });

    await post.update({
        $inc: {
            commentCount: 1,
        } 
    })

    return comment;
}

module.exports = {
    addComment,
    getCommentsByPostId,
}