import mongoose from 'mongoose';

const changeRequestSchema = new mongoose.Schema({
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    updates: {
        address: String,
        price: Number,
        description: String,
        power: Boolean,
        water: Boolean,
        security: Boolean
    },
    approved: {
        type: Boolean,
        default: false,
    },
    comments: {
        type: String,
        default: ''
    }
}, { timestamps: true });

export default mongoose.model('ChangeRequest', changeRequestSchema);
