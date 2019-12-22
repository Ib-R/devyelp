const express = require('express');
const env = require('dotenv');

// Route files
const devcompaines = require('./routes/devcompanies');

// Load env variables
env.config({ path: '.env' });

const app = express();

//Mount routers
app.use('/api/v1/devcompanies', devcompaines);

let port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${port}`);
})