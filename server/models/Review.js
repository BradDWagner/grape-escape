const mongoose = require('mongoose');

const { Schema } = mongoose;

const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        required: true,
        default: 0,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;