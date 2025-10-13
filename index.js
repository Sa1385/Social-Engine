import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { io as initIO, users } from './startup/socket.js';

import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';

import auth from './routes/auth.js';
import tag from './routes/tag.js';
import post from './routes/post.js';
import comment from './routes/comment.js';
import notification from './routes/notification.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('DB connected successfully'))
    .catch(err => {
        console.log('DB failed to connect!', err);
        process.exit(1);
    });

// Check JWT secret
if (!process.env.JWT_SECRET) {
    console.log('JWT not configured!');
    process.exit(1);
}

app.use(cors());
app.use(express.json());

// Serve uploads folder
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Initialize Socket.IO
const io = initIO(server);

// Attach socket and helper functions to requests
app.use((req, res, next) => {
    req.io = io;
    req.users = users;
    req.notify = user => user in req.users && req.users[user].emit('notification');
    next();
});

// API routes
app.use('/api/auth', auth);
app.use('/api/tags', tag);
app.use('/api/post', post);
app.use('/api/comment', comment);
app.use('/api/notification', notification);

// Root route: API overview
app.get('/', (req, res) => {
    res.send(`
        <h1>Social Engine API</h1>
        <p>Welcome! Here are the available endpoints:</p>
        <ul>
            <li><strong>Auth:</strong>
                <ul>
                    <li>POST /api/auth/register</li>
                    <li>POST /api/auth/login</li>
                </ul>
            </li>
            <li><strong>Tags:</strong>
                <ul>
                    <li>GET /api/tags</li>
                    <li>POST /api/tags</li>
                    <li>GET /api/tags/:id</li>
                    <li>PUT /api/tags/:id</li>
                    <li>DELETE /api/tags/:id</li>
                </ul>
            </li>
            <li><strong>Posts:</strong>
                <ul>
                    <li>GET /api/post</li>
                    <li>POST /api/post</li>
                    <li>PATCH /api/post/:id/view</li>
                    <li>POST /api/post/upvote/:id</li>
                    <li>POST /api/post/downvote/:id</li>
                </ul>
            </li>
            <li><strong>Comments:</strong>
                <ul>
                    <li>GET /api/comment/:post_id</li>
                    <li>POST /api/comment</li>
                    <li>POST /api/comment/reply/:comment_id</li>
                </ul>
            </li>
            <li><strong>Notifications:</strong>
                <ul>
                    <li>GET /api/notification</li>
                    <li>PUT /api/notification/:id</li>
                    <li>GET /api/notification/read-all</li>
                </ul>
            </li>
        </ul>
    `);
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

