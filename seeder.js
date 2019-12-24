const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const Company = require('./models/Company');
const Job = require('./models/Job');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

// Read JSON file
const companies = JSON.parse(fs.readFileSync(`${__dirname}/_data/companies.json`, 'utf-8'));
const jobs = JSON.parse(fs.readFileSync(`${__dirname}/_data/jobs.json`, 'utf-8'));

// Import into DB
const importData = async () => {
    try {
        await Company.create(companies);
        // await Job.create(jobs);
        console.log('Data imported...'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
};

// Delete data
const deleteData = async () => {
    try {
        await Company.deleteMany();
        await Job.deleteMany();
        console.log('Data deleted...'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
};

if (process.argv[2] == '-i') {
    importData();
} else if (process.argv[2] == '-d') {
    deleteData();
}