import { Router } from 'express';
import auth from '../middleware/auth.js';
import Post from '../models/Post.js';
import Tag from '../models/Tag.js';
import User from '../models/User.js';
import { extname } from 'path';
import { randomBytes } from 'crypto';
import multer from 'multer';
import { existsSync, mkdirSync } from 'fs';

const router = Router();

// Setup upload folder
const uploadDir = 'uploads/';
if (!existsSync(uploadDir)) mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = extname(file.originalname);
    const filename = randomBytes(16).toString('hex') + ext;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30 MB
  fileFilter: (req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.mp4'].includes(ext)) cb(null, true);
    else cb(new Error('Invalid file type'));
  }
}).single('media');

// Create a new post
router.post('/', auth, (req, res) => {
  upload(req, res, async err => {
    if (err) return res.status(400).send(err.message);

    try {
      const tag = await Tag.findById(req.body.tag);
      if (!tag) return res.status(400).send('Invalid tag ID');

      const slug =
        req.body.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') +
        '-' +
        Math.floor(Math.random() * 1e8).toString(36) +
        '-' +
        tag.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

      const postData = {
        ...req.body,
        slug,
        author: req.user
      };

      if (req.file) {
        postData.media = {
          type: req.file.mimetype.startsWith('video') ? 'video' : 'image',
          path: req.file.path
        };
      }

      const post = new Post(postData);
      await post.save();
      res.status(201).send(post);
    } catch (error) {
      console.error(error);
      res.status(500).send('Something went wrong!');
    }
  });
});

// Get posts
router.get('/', async (req, res) => {
  const { tag, id } = req.query;
  const query = {};
  if (tag) query.tag = tag;
  if (id) query._id = id;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const posts = await Post.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-createdAt -updatedAt -__v -group')
      .populate('author', 'username')
      .populate('tag', 'name')
      .sort('-createdAt');

    if (id && posts.length > 0) {
      posts[0].views = (posts[0].views || 0) + 1;
      await posts[0].save();
    }

    res.send(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong!');
  }
});

// Increment view count
router.patch('/:id/view', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send('Post not found');

    post.views = (post.views || 0) + 1;
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Upvote a post
router.post('/upvote/:id', auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id, liked_posts: req.params.id });

    if (user) {
      await Post.updateOne({ _id: req.params.id }, { $inc: { points: -1 } });
      const u = await User.findById(req.user._id);
      u.liked_posts.pull(req.params.id);
      await u.save();
      return res.send({ message: 'Upvote removed' });
    }

    await Post.updateOne({ _id: req.params.id }, { $inc: { points: 1 } });
    const u = await User.findById(req.user._id);
    u.liked_posts.push(req.params.id);
    await u.save();
    res.send({ message: 'Upvote added' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Downvote a post
router.post('/downvote/:id', auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id, disliked_posts: req.params.id });

    if (user) {
      await Post.updateOne({ _id: req.params.id }, { $inc: { points: 1 } });
      const u = await User.findById(req.user._id);
      u.disliked_posts.pull(req.params.id);
      await u.save();
      return res.send({ message: 'Downvote removed' });
    }

    await Post.updateOne({ _id: req.params.id }, { $inc: { points: -1 } });
    const u = await User.findById(req.user._id);
    u.disliked_posts.push(req.params.id);
    await u.save();
    res.send({ message: 'Downvote added' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
