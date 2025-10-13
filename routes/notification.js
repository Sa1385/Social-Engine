import { Router } from 'express';
import Notification from '../models/Notification.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/', auth, async (req, res) => {
    try {
        const notifications = await Notification.find({ receiver: req.user._id, is_read: false })
            .select('-createdAt -updatedAt -__v')
            .sort('createdAt');
        res.send(notifications);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Mark single notification as read
router.put('/:id', auth, async (req, res) => {
    try {
        const notf = await Notification.findById(req.params.id);
        if (!notf) return res.status(404).send('Notification not found');

        if (!notf.receiver.equals(req.user._id)) {
            return res.status(403).send('Access denied!');
        }

        notf.is_read = true;
        const saved = await notf.save();
        res.send(saved);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Mark all notifications as read
router.get('/read-all', auth, async (req, res) => {
    try {
        const result = await Notification.updateMany(
            { receiver: req.user._id },
            { is_read: true }
        );
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

export default router;
