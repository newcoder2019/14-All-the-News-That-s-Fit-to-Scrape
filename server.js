const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const cheerio = require('cheerio');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

mongoose.connect('mongodb://localhost/stackScraper', { useNewUrlParser: true });

app.set(require('./routes')(app));
app.listen(3006, _ => console.log('http://localhost:3006'));