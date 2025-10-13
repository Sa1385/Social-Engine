import express from 'express'
const router = express.Router()

import bcrypt from 'bcrypt'
import User from '../models/User.js'
import pkg from 'jsonwebtoken'
const { sign, verify } = pkg

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }).select('-createdAt -updatedAt -__v -userid')

        if (!user) return res.status(400).send('Incorrect username or password')

        const match = await bcrypt.compare(req.body.password, user.password)
        if (!match) return res.status(400).send('Incorrect username or password')

        // generate JWT
        const token = sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.header('x-auth-token', token).send({ token, ...user._doc, password: null })
    } catch (err) {
        res.status(500).send(err.message)
    }
})

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body

        const hash = await bcrypt.hash(password, 10)

        const user = await User.create({
            username,
            email,
            password: hash
        })

        // generate JWT
        const token = sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.header('x-auth-token', token).status(201).send({ token, ...user._doc, password: null })
    } catch (err) {
        res.status(400).send(err.message)
    }
})

export default router
