const mongoose = require('mongoose');

const reviewCountSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'Product',
    },
    review_count: {
        type: Number,
        default: 0,
    },
    total_rating: {
        type: Number,
        default: 0,
    },
});

const ReviewCount = mongoose.model('ReviewCount', reviewCountSchema);

module.exports = ReviewCount;
