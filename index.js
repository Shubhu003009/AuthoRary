// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').parse();
// }

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true }, () => {
  console.log('DB Connected');
});
// const db = mongoose.connection;
// db.on('error', (error) => {
//   console.log(error);
// });
// db.once('open', () => {
//   console.log('DB connected');
// });

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));

const indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log('server started');
});
