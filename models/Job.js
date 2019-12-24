const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please enter job title']
    },
    desc: {
        type: String,
        required: [true, 'Please enter descreption']
    },
    desc: {
        type: String,
        required: [true, 'Please enter descreption']
    },
    days: {
        type: Number,
        required: [true, 'Please enter number of days']
    },
    salary: {
        type: Number,
        required: [true, 'Please enter salary']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please enter minimum skill level'],
        enum: ['fresh', 'junior', 'senior']
    },
    trainingAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company',
        required: true
    }
});

module.exports = mongoose.model('Job', JobSchema);