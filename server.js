const express = require('express');
const env = require('dotenv');
const logger = require('morgan');

// Route files
const compaines = require('./routes/companies');

// Load env variables
env.config({ path: '.env' });

const app = express();

// Mount middlewares
if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
}

//Mount routers
app.use('/api/v1/companies', compaines);

let port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${port}`);
})