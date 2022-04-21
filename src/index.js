const path = require('path');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
var bodyParser = require('body-parser');
const routes = require('./routes');
const helper = require('./util/helpers');

const port = 3000;
const app = express();
const hbs = handlebars.create({
    extname: '.hbs',
    helpers: {
        sum: (a, b) => a + b,
        eachCategories: helper.eachCategories,
        ifEquals: helper.ifEquals,
    },
});

dotenv.config();

app.use(cors());
app.use(cookieParser());

// method override
app.use(methodOverride('_method'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

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