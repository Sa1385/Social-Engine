import { Router } from 'express'
const router = Router()

import Tag from '../models/Tag.js'

router.get('/', async (req, res) => {
    try {
        const tags = await Tag.find().select('-createdAt -updatedAt -__v')
        res.json(tags)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const tag = new Tag(req.body)
        await tag.save()
        res.status(201).json(tag)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const tag = await Tag.findById(req.params.id)
        if (!tag) return res.status(404).json({ error: 'Tag not found' })
        res.json(tag)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const tag = await Tag.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        )
        if (!tag) return res.status(404).json({ error: 'Tag not found' })
        res.json(tag)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const tag = await Tag.findByIdAndDelete(req.params.id)
        if (!tag) return res.status(404).json({ error: 'Tag not found' })
        res.json(tag)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

export default router
