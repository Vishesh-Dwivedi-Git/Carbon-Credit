import mongoose from 'mongoose';

const CarbonTradeRequestSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Org',
        required: true
    },
    requestType: {
        type: String,
        enum: ['BUY', 'SELL'],
        required: true
    },
    carbonTokenAmount: {
        type: Number,
        required: true,
        min: [0, 'Carbon token amount must be positive']
    },
    pricePerToken: {
        type: Number,
        required: true,
        min: [0, 'Price per token must be positive']
    },
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING'
    },
    matchedWith: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Org',
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const CarbonTradeRequest = mongoose.model('CarbonTradeRequest', CarbonTradeRequestSchema);

export default CarbonTradeRequest;