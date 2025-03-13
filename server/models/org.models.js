import mongoose from 'mongoose';


const OrgSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        min: [6, 'Password must be at least 6 characters'],
        required: true
    },
    org_name: {
        type: String,
        required: true
    },
    org_type: {
        type: String,
        required: true,
        enum: ['NGO', 'Oil & Gas', 'Steel & Cement', 'Renewable Energy', 'Recycling & Waste Management', 'Aviation & Shipping']
    },
    org_stars: {
        type: Number,
        default: 0
    },
    accessToken: {
        type: String,
    },
    refreshToken: {
        type: String,
    }
}, {timestamps: true});


const Org = mongoose.model('Org', OrgSchema);

export default Org;