if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

//todo: ROUTE IMPORTS
const indexRouter = require('./routes/index')
const authorsRouter = require('./routes/authors')
const bookRouter = require('./routes/books')

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

const methodOverride = require('method-override')
const bodyParser = require('body-parser')

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', ()=> console.log('DB CONNECTED'))


app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')

const path = require('path'); 
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))


//TODO: ROUTES
app.use('/', indexRouter)
app.use('/authors', authorsRouter)
app.use('/books', bookRouter)


app.listen(process.env.PORT || 3000 , () => {
    console.log(`server : http://localhost:${process.env.PORT}`);
})