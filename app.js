require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');

const connectDB = require('./server/config/db');

const app = express();
const port = process.env.PORT || 3000;


// Connect to DB
connectDB();

app.use(express.static('public'));

app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'));

// app.get('/', (req, res) => {
//     res.send("hello world!");
// });

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});