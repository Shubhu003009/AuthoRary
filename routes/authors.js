const express = require('express')
const AUTHOR = require('../models/author')
const BOOK = require('../models/book')
const router = express.Router()


//TODO: GET ALL AUTHORS
router.get('/', async(req,res)=>{
    let searchOptions = {}
    if(req.query.name != null && req.query.name != ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await AUTHOR.find(searchOptions)
        res.render('authors/index', {authors: authors, searchOptions: req.query})
    } catch (err) {
        res.redirect('/')
    }
})

//TODO: GET NEW AUTHOR PAGE
router.get('/new', (req,res) => {
    res.render('authors/new', {author: new AUTHOR})
})

//! CREATE NEW AUTHOR
router.post('/', async(req,res) => {
    const author = new AUTHOR({
        name: req.body.name.replace(/\s+/g, ' ').trim()
    })
    try {
        const newauthor = await author.save()
        res.redirect(`authors/${newauthor.id}`) 
    } catch (error) {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating author', 
        })
    }
})

//TODO: GET USER WITH ID
router.get('/:id', async(req, res) => {
    try {
        const author = await AUTHOR.findById(req.params.id)
        const books = await BOOK.find({author: author.id}).limit(6).exec()
        res.render('authors/show',{
            author: author,
            booksByAuthor: books
        })
    } catch {   
        res.redirect('/')
    }
})

//TODO: EDIT USER WITH ID 
router.get('/:id/edit', async(req, res) => {
    try {
        const author = await AUTHOR.findById(req.params.id)
        res.render('authors/edit', {author: author})
    } catch (error) {
        res.redirect('/authors')
    }
    
})

//! EDIT AUTHOR WITH ID
router.put('/:id', async(req, res) => {
    let author
    try {
        author = await AUTHOR.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`) 
    } catch (error) {
        if(author == null){
            res.redirect('/')
        }else{
            res.render('authors/new', {
                author: author,
                errorMessage: 'Error updating author', 
            })
        }
    }
})

//! DELETE AUTHOR WITH ID
router.delete('/:id', async(req, res) => {
    let author
    try {
        author = await AUTHOR.findById(req.params.id)
        await author.deleteOne()
        res.redirect('/authors') 
    } catch (error) {
        if(author == null){
            res.redirect('/')
        }else{
            res.redirect(`/authors/${author.id}`)
        }
    }
})

module.exports = router