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
    newAddress: String,
    newPrice: Number,
    newDescription: String,
    approved: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export default mongoose.model('ChangeRequest', changeRequestSchema);
