const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  offeringId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offering',
    required: true
  },
  admissionCycleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdmissionCycle',
    required: true
  },
  
  // Personal Details (from profile)
  personalDetails: {
    fullName: String,
    fatherName: String,
    dateOfBirth: Date,
    gender: String,
    nationality: String,
    category: String,
    aadhaarNumber: String,
    maritalStatus: String,
    isPWD: Boolean,
    profilePhoto: String
  },
  
  // Communication Details (from profile)
  communicationDetails: {
    addressForCommunication: String,
    city: String,
    state: String,
    pinCode: String,
    permanentAddress: String,
    permanentCity: String,
    permanentState: String,
    permanentPinCode: String
  },
  
  // Educational Details (from profile)
  educationalDetails: {
    tenth: Object,
    twelfth: Object,
    ug: Object,
    pg: Object
  },
  
  // Documents
  documents: {
    photo: String,
    signature: String,
    marksheets: [String],
    certificates: [String],
    categoryProof: String,
    pwdCertificate: String,
    other: [String]
  },
  
  // Payment Details
  paymentDetails: {
    amount: Number,
    transactionId: String,
    bank: String,
    transactionSlip: String,
    paymentDate: Date,
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending'
    }
  },
  
  // Application Status
  status: {
    type: String,
    enum: ['Draft', 'Submitted', 'Under Review', 'Shortlisted', 'Rejected', 'Accepted', 'Waitlisted'],
    default: 'Draft'
  },
  
  // Remarks from admin
  remarks: {
    type: String
  },
  
  // Result
  result: {
    type: String,
    enum: ['Selected', 'Rejected', 'Waitlisted', 'Pending'],
    default: 'Pending'
  },
  
  // Timeline
  submittedAt: Date,
  reviewedAt: Date,
  resultPublishedAt: Date
  
}, {
  timestamps: true
});

// Generate application ID before saving
applicationSchema.pre('save', async function(next) {
  if (!this.applicationId) {
    const count = await this.constructor.countDocuments();
    this.applicationId = `APP${new Date().getFullYear()}${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
