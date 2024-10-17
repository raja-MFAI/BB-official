const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    primaryInfo: {
        customerName: { type: String, required: true },
        quantity: { type: Number, required: true },
        productId: { type: String, required: true },
        productName: { type: String, required: true },
        productCategory: { type: String, required: true },
        approved: { type: Boolean, default: false },
        shippingStatus: {
            type: String,
            enum: ['Pending', 'Shipped', 'Delivered', 'Issues'], // Restrict status to specific values
            default: 'Pending'
        },
        price: { type: Number, required: true },
        imageUrl: { type: String, required: true },
        estimatedDeliveryDate: { type: Date, required: true }, // Add estimated delivery date
    },
    secondaryInfo: {
        customerEmail: { type: String, required: true },
        customerPhone: { type: String, required: true },
        city: { type: String, required: true },
        address: { type: String, required: true },
        shippingID: { type: String, default: null },
    }
}, { timestamps: true });

// Add a pre-save hook to automatically mark orders as delivered if the estimated delivery date has passed
orderSchema.pre('save', function (next) {
    const now = new Date();
    if (this.primaryInfo.estimatedDeliveryDate && now > this.primaryInfo.estimatedDeliveryDate) {
        this.primaryInfo.shippingStatus = 'Delivered';
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
