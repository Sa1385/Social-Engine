import { Router } from 'express';
import Comment from '../models/Comment.js';
import Notification from '../models/Notification.js';
import Post from '../models/Post.js';
import auth from '../middleware/auth.js';

const router = Router();

// Create comment
router.post('/', auth, async (req, res) => {
    try {
        const comment = new Comment({
            ...req.body,
            author: req.user
        });
        const savedComment = await comment.save();

        res.status(201).send(savedComment);

        // Create notification
        const post = await Post.findById(req.body.post_id); // make sure post_id is sent in req.body
        if (post) {
            const notification = new Notification({
                text: `${req.user._id} commented on your post "${post.title}"`,
                receiver: post.author,
                url: post.slug
            });
            await notification.save();

            if (req.notify) req.notify(post.author);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Create reply to a comment
router.post('/reply/:comment_id', auth, async (req, res) => {
    try {
        const parentComment = await Comment.findById(req.params.comment_id).populate('post_id', '_id title slug');
        if (!parentComment) return res.status(404).send('Parent comment not found');

        const replyComment = new Comment({
            ...req.body,
            post_id: parentComment.post_id._id,
            author: req.user,
            is_reply: true
        });

        const savedReply = await replyComment.save();

        // Push reply to parent comment
        await Comment.updateOne(
            { _id: req.params.comment_id },
            { $push: { replies: savedReply._id } }
        );

        res.status(201).send(savedReply);

        // Create notification
        const notification = new Notification({
            text: `${req.user._id} replied to your comment on post "${parentComment.post_id.title}"`,
            receiver: parentComment.author,
            url: parentComment.post_id.slug
        });
        await notification.save();

        if (req.notify) req.notify(parentComment.author);

    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Get comments for a post
router.get('/:post_id', async (req, res) => {
    try {
        const comments = await Comment.find({ post_id: req.params.post_id, is_reply: false });
        res.send(comments);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

export default router;

