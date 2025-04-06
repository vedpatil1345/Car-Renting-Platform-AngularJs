const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Car name is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    image: {
        type: String,
        required: [true, 'Image URL is required']
    },
    available: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    specifications: {
        type: Map,
        of: String,
        default: {}
    },
    category: {
        type: String,
        enum: ['economy', 'luxury', 'suv', 'sports'],
        default: 'economy'
    }
});

module.exports = mongoose.model('Car', carSchema);