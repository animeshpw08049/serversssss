const express = require('express');
const router = express.Router()
const auth = require('../middleware/auth');

const commentControllers = require('../controllers/comment.js');

// READ
router.get('/post/:postId/comments', async (req, res) => {
    const postId = req.params.postId;

    try {
        let comments = await commentControllers.getCommentsByPostId(postId);

        return res.send({
            data: comments
        });
    } catch(err) {
        console.error(err.message);

        return res.status(500).send({
            message: err.message // 'Server ran into an unexpected error'
        })
    }

})


// CREATE
router.post('/post/:postId/comment', auth, async (req, res) => {

    const commentData = req.body;
    const postId = req.params.postId;

    const userId = req.user._id;

    let comment = null;
    try {
        comment = await commentControllers.addComment(userId, postId, commentData);
    } catch(err) {
        console.error(err.message);

        return res.status(500).send({
            message: err.message // 'Server ran into an unexpected error'
        })
    }

    return res.send({
        data: comment
    });
})

module.exports = router;