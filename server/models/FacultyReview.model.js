const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  comments: {
    type: String,
    required: true
  },
  decision: {
    type: String,
    enum: ['Shortlisted', 'Rejected', 'Waitlisted', 'Pending'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FacultyReview', reviewSchema);
