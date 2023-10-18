const mongoose = require('mongoose')
const BOOK = require('./book')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})



authorSchema.pre('deleteOne', {document:true,query:false}, function(next){
    BOOK.find({author: this.id}).then(books => {
        if(books.length > 0 ){
            next(new Error('This author has books in library'))
        }else{
            next()
        }
    }).catch(err =>{
        next(err)
    })
})

const AUTHOR = mongoose.model('Author', authorSchema)

module.exports = AUTHOR