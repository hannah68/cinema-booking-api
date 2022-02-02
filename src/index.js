// Load our .env file
require('dotenv').config();

// Import express and cors
const express = require('express');
const cors = require('cors');

// Set up express
const app = express();
app.disable('x-powered-by');
app.use(cors());
// Tell express to use a JSON parser middleware
app.use(express.json());
// Tell express to use a URL Encoding middleware
app.use(express.urlencoded({ extended: true }));


const customerRouter = require('./routers/customer');
const moviesRouter = require('./routers/movie');
const screenRouter = require('./routers/screen');
const ticketRouter = require('./routers/ticket');
const reviewRouter = require('./routers/review');


app.use('/customer', customerRouter);
app.use('/movies', moviesRouter);
app.use('/screen', screenRouter);
app.use('/ticket', ticketRouter);
app.use('/movies/:id/review', reviewRouter);


app.get('*', (req, res) => {
    res.json({ ok: true });
});

// Start our API server
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`\n Server is running on http://localhost:${port}\n`);
});
