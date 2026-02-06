const mongoose = require('mongoose');

const admissionCycleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Admission cycle name is required'],
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  fees: {
    GEN: {
      type: Number,
      default: 500
    },
    OBC: {
      type: Number,
      default: 500
    },
    EWS: {
      type: Number,
      default: 500
    },
    SC: {
      type: Number,
      default: 250
    },
    ST: {
      type: Number,
      default: 250
    },
    PWD: {
      type: Number,
      default: 250
    }
  },
  brochureUrl: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Ensure only one active cycle at a time
admissionCycleSchema.pre('save', async function(next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
  }
  next();
});

module.exports = mongoose.model('AdmissionCycle', admissionCycleSchema);
