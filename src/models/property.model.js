import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        enum: ['1 bedroom', '2 bedroom', '3 bedroom', '4 bedroom', 'duplex', 'bungalow', 'loft', 'beach house'],
    },
}, { timestamps: true });

export default mongoose.model('Property', propertySchema);
