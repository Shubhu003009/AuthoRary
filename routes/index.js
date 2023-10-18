const express = require('express')
const BOOK = require('../models/book')
const router = express.Router()

router.get('/', async(req,res) => {
    let books;
    try {
        books = await BOOK.find().sort({createAt: 'desc'}).limit(10).exec()
        res.render('index', {books: books})
    } catch (error) {
        books = []
    }
})

module.exports = router