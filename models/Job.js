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
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

// Static method
JobSchema.statics.getAverageSalary = async function (companyId) {
    const dataToUpdate = await this.aggregate([
        {
            $match: { company: companyId }
        },
        {
            $group: {
                _id: '$company',
                averageSalary: { $avg: '$salary' }
            }
        }
    ]);

    try {
        await this.model('Company')
            .findByIdAndUpdate(companyId, {
                averageSalary: Math.ceil(dataToUpdate[0].averageSalary)
            });
    } catch (error) {
        console.error(error);
    }
};

// Invoke getAverageSalary after save
JobSchema.post('save', function (next) {
    this.constructor.getAverageSalary(this.company);
});

// Invoke getAverageSalary before remove
JobSchema.pre('remove', function (next) {
    this.constructor.getAverageSalary(this.company);
});

module.exports = mongoose.model('Job', JobSchema);