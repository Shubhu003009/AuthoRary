
const express = require('express')
const router = express.Router()

const BOOK = require('../models/book')
const AUTHOR = require('../models/author')

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']




//TODO: ALL BOOKS
router.get('/', async(req,res)=>{

    let query = BOOK.find()
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    
    try {
        const books = await query.exec()
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    } catch (error) {
        res.redirect('/')
    }
    
})

//TODO: NEW BOOK
router.get('/new', async(req,res) => {
    renderNewPage(res, new BOOK())
})

//TODO: CREATE BOOK 
router.post('/', async(req,res) => {
    const book = new BOOK({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    })
    saveCover(res, book, req.body.cover)
    try {
        const newBook = await book.save()
        res.redirect(`books/${newBook.id}`)
    } catch (err) {
        console.log(err);
        renderNewPage(res, book, true)
    }
})

//TODO: SHOW BOOK 
router.get('/:id', async(req, res)=>{
    try {
        const book = await BOOK.findById(req.params.id).populate('author').exec()
        res.render('books/show', {book: book})
    } catch (error) {
        res.redirect('/')
    }
})

//TODO: EDIT BOOK
router.get('/:id/edit', async(req,res) => {
    try {
        const book = await BOOK.findById(req.params.id)
        renderEditPage(res, book)
    } catch (error) {
        res.redirect('/')
    }
})

//TODO: UPDATE BOOK 
router.put('/:id', async(req,res) => {
    let book
    try {
        book = await BOOK.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.title
        if(req.body.cover != null && req.body.cover != ''){
            saveCover(res, book, req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    } catch {
        if(book != null){
            renderEditPage(res, book, true)
        }else{
            res.redirect('/')
        }
    }
})

//TODO: DELETE BOOK
router.delete('/:id', async(req, res)=>{
    let book
    try {
        book = await BOOK.findById(req.params.id)
        await book.deleteOne()
        res.redirect('/books')
    } catch (error) {
        if(book != null){
            res.render('books/show',{
                book:book,
                errorMessage: 'Could not remove book'
            })
        }else{
            res.redirect('/')
        }
    }
})

//TODO: NEW RENDER PAGE ()
async function renderNewPage(res, book, hasError = false){
    renderFormPage(res, book, 'new', hasError)
}

//TODO: EDIT RENDER PAGE ()
async function renderEditPage(res, book, hasError = false){
    renderFormPage(res, book, 'edit', hasError)
}

//TODO: RENDER FORM PAGE ()
async function renderFormPage(res, book, form, hasError = false){
    try {
        const authors = await AUTHOR.find({})
        const params = { authors: authors, book: book }
        if(hasError){
            if(form === 'edit'){
                params.errorMessage = 'Error Updating Book'
            }else{
                params.errorMessage = 'Error Creating Book'
            }
        }
        res.render(`books/${form}`, params)
    } catch (err) {
        res.redirect('/books')
    }
}

//TODO: SAVE COVER ()
function saveCover(res, book, coverEncoded){
    try {
        if(coverEncoded == null) return
        const cover = JSON.parse(coverEncoded)
        if(cover != null && imageMimeTypes.includes(cover.type)){
            book.coverImage = new Buffer.from(cover.data, 'base64')
            book.coverImageType = cover.type
        }
    } catch {
        res.redirect('/')
    }
}

module.exports = router
