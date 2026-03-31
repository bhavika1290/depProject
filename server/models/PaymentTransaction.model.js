const mongoose = require('mongoose');

const paymentTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending'
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true
    },
    razorpayPaymentId: {
      type: String,
      default: ''
    },
    razorpaySignature: {
      type: String,
      default: ''
    },
    paidAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('PaymentTransaction', paymentTransactionSchema);
