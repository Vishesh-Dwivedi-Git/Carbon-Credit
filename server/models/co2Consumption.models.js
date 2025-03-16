import mongoose from 'mongoose';

const CO2ConsumptionSchema = new mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Org',
        required: true
    },
    reportYear: {
        type: Number,
       
    },
    reportMonth: {
        type: Number,
       
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
            
        },
        emissions: {
            type: Number,
            
            min: 0
        }
    }],
    documentProof: {
        type: String, 
       
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