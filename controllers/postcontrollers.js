import { find, findById } from '../models/Post.js';
export async function getPosts(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const posts = await find({ is_active: true, is_public: true })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('author', 'name')
            .populate('tag', 'name');

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Increment post views
export async function incrementView(req, res) {
    try {
        const post = await findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        post.views += 1;
        await post.save();

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
