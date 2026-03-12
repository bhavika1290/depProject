const mongoose = require('mongoose');

const offeringSchema = new mongoose.Schema({
  admissionCycleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdmissionCycle',
    required: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: [
      'Biomedical Engineering',
      'Chemical Engineering',
      'Civil Engineering',
      'Computer Science and Engineering',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Chemistry',
      'Humanities and Social Sciences',
      'Metallurgical and Material Engineering',
      'Physics',
      'Mathematics',
      'Mathematics and Computing'
    ]
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required']
  },
  offeringType: {
    type: String,
    required: [true, 'Offering type is required'],
    enum: ['Regular', 'External', 'Part-Time', 'Direct', 'Staff Member', 'Project Staff']
  },
  eligibility: {
    type: String,
    default: 'View'
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  },
  status: {
    type: String,
    enum: ['Open', 'Closed'],
    default: 'Open'
  },
  resultsPublished: {
    type: Boolean,
    default: false
  },
  description: {
    type: String
  },
  numberOfSeats: {
    type: Number,
    default: 0
  },
  minimumQualification: {
    type: String
  },
  researchAreas: [{
    type: String
  }],
  facultyInCharge: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Auto-update status based on deadline
// Note: Removed because it intercepts every find query and causes it to return empty/fail 
// if the updateMany inside triggers a validation error (e.g. strict populated paths).
// offeringSchema.pre('find', function() {
//   const now = new Date();
//   this.updateMany(
//     { deadline: { $lt: now }, status: 'Open' },
//     { status: 'Closed' }
//   ).catch(err => console.error("Error in pre(find) hook:", err));
// });

module.exports = mongoose.model('Offering', offeringSchema);
