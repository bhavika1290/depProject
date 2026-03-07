const mongoose = require('mongoose');

const openingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title for opening is required'],
    trim: true
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  researchArea: {
    type: String,
    required: [true, 'Research area is required']
  },
  positions: {
    type: Number,
    required: [true, 'Available positions count is required'],
    min: 1
  },
  minGateScore: {
    type: Number,
    default: 0
  },
  minCsirScore: {
    type: Number,
    default: 0
  },
  minCGPA: {
    type: Number,
    required: [true, 'Minimum CGPA is required'],
    min: 0,
    max: 10
  },
  allowedCategories: [{
    type: String,
    enum: ['GEN', 'OBC', 'SC', 'ST', 'EWS', 'PWD']
  }],
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  },
  status: {
    type: String,
    enum: ['Open', 'Closed', 'Filled'],
    default: 'Open'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PhDOpening', openingSchema);
