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
    power: {
        type: Boolean,
        default: true,
    },
    water: {
        type: Boolean,
        default: true,
    },
    security: {
        type: Boolean,
        default: true,
    },
    pendingUpdates: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
      }
}, { timestamps: true });

export default mongoose.model('Property', propertySchema);
