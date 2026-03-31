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
  
  // General Application Details (Step 1)
  generalApplicationDetails: {
    interdisciplinaryProgram: {
      type: Boolean,
      default: false
    },
    interdisciplinaryDepartment: String,
    modeOfApplication: String,
    areaOfResearchPrefs: [String], // Array up to 4 preferences
    specificAreaOfResearch: String,
    sop: String,
    keywords: [String]
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

  // Qualifying Exam Details (Step 2)
  qualifyingExams: [{
    examName: String,
    subject: String,
    yearOfPassing: Number,
    score: String,
    rank: String,
    validUpTo: Date
  }],

  // Experiences and Publications (Step 3)
  experienceDetails: [{
    organization: String,
    designation: String,
    startDate: Date,
    endDate: Date,
    responsibilities: String
  }],
  publications: [{
    title: String,
    journal: String,
    year: Number,
    status: String
  }],
  
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
  
  // Payment Details (Step 4)
  paymentDetails: {
    category: String,
    amount: Number,
    transactionId: String,
    bank: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    transactionSlip: String,
    paymentDate: Date,
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending'
    }
  },

  // Declaration (Step 5)
  declarationAccepted: {
    type: Boolean,
    default: false
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

  // Interview & Final Selection Details
  interviewStatus: {
    type: String,
    enum: ['Pending Scheduling', 'Scheduled', 'Rescheduled', 'Completed', 'Absent', 'Selected', 'Waitlisted', 'Rejected'],
    default: 'Pending Scheduling'
  },
  interviewDate: Date,
  interviewScore: {
    type: Number,
    min: 0,
    max: 100
  },
  facultyRemarks: String,
  admissionRank: Number,
  
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
    const count = await mongoose.model('Application').countDocuments();
    this.applicationId = `APP${new Date().getFullYear()}${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
