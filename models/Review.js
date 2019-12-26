const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        maxlength: 100,
        required: [true, 'Please enter title']
    },
    text: {
        type: String,
        required: [true, 'Please enter some text']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please enter rating from 1 to 10']
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

// Prevent user from submitting more than one review per company
ReviewSchema.index({ company: 1, user: 1 }, { unique: true });

// Static method
ReviewSchema.statics.getAverageRating = async function (companyId) {
    const dataToUpdate = await this.aggregate([
        {
            $match: { company: companyId }
        },
        {
            $group: {
                _id: '$company',
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    try {
        await this.model('Company')
            .findByIdAndUpdate(companyId, {
                averageRating: Math.ceil(dataToUpdate[0].averageRating)
            });
    } catch (error) {
        console.error(error);
    }
};

// Invoke getAverageRating after save
ReviewSchema.post('save', function () {
    this.constructor.getAverageRating(this.company);
});

// Invoke getAverageRating before remove
ReviewSchema.pre('remove', function () {
    this.constructor.getAverageRating(this.company);
});

module.exports = mongoose.model('Review', ReviewSchema);