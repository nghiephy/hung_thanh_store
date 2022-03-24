const path = require('path');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const routes = require('./routes');
const helper = require('./util/helpers');

const port = 3000;
const app = express();
const hbs = handlebars.create({
    extname: '.hbs',
    helpers: {
        sum: (a, b) => a + b,
        eachCategories: helper.eachCategories,
    },
});

// HTTP logger
app.use(morgan('combined'))

// Setup static path
app.use(express.static(path.join(__dirname, 'public')));

//Template engine * hbs must be the same with extname dafaut is handlebars
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// app.get('/', (req, res) => {
//     res.render('home');
// })

// Routes init
routes(app);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});