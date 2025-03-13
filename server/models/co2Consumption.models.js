import mongoose from 'mongoose';

const CO2ConsumptionSchema = new mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Org',
        required: true
    },
    reportYear: {
        type: Number,
        required: true
    },
    reportMonth: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    totalEmissions: {
        type: Number,
        required: true,
        min: 0
    },
    emissionSources: [{
        source: {
            type: String,
            required: true
        },
        emissions: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    documentProof: {
        type: String, 
        required: true
    },
    verificationStatus: {
        type: String,
        enum: ['PENDING', 'VERIFIED', 'REJECTED'],
        default: 'PENDING'
    },
    starsEarned: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const CO2Consumption = mongoose.model('CO2Consumption', CO2ConsumptionSchema);

export default CO2Consumption;