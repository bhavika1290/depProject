const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  personalInfo: {
    fullName: String,
    fatherName: String,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', '']
    },
    nationality: String,
    category: {
      type: String,
      enum: ['GEN', 'SC', 'ST', 'OBC', 'EWS', '']
    },
    aadhaarNumber: String,
    maritalStatus: {
      type: String,
      enum: ['Single', 'Married', 'Divorced', 'Widowed', '']
    },
    isPWD: {
      type: Boolean,
      default: false
    },
    profilePhoto: String
  },
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
  educationalDetails: {
    tenthSchool: String,
    tenthBoard: String,
    tenthYear: Number,
    tenthPercentage: Number,
    
    twelfthSchool: String,
    twelfthBoard: String,
    twelfthYear: Number,
    twelfthPercentage: Number,
    
    ugCollege: String,
    ugUniversity: String,
    ugDegree: String,
    ugSpecialization: String,
    ugYear: Number,
    ugCGPA: Number,
    
    pgCollege: String,
    pgUniversity: String,
    pgDegree: String,
    pgSpecialization: String,
    pgYear: Number,
    pgCGPA: Number
  },
  documents: {
    photo: String,
    signature: String,
    tenthMarksheet: String,
    twelfthMarksheet: String,
    ugMarksheet: String,
    ugDegree: String,
    pgMarksheet: String,
    pgDegree: String,
    categoryProof: String,
    pwdCertificate: String
  },
  completionStatus: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Calculate completion status
profileSchema.methods.calculateCompletion = function() {
  let filledFields = 0;
  let totalFields = 0;
  
  // Count personal info fields
  const personalFields = ['fullName', 'fatherName', 'dateOfBirth', 'gender', 'nationality', 'category', 'aadhaarNumber', 'maritalStatus'];
  personalFields.forEach(field => {
    totalFields++;
    if (this.personalInfo[field]) filledFields++;
  });
  
  // Count communication fields
  const commFields = ['addressForCommunication', 'city', 'state', 'pinCode'];
  commFields.forEach(field => {
    totalFields++;
    if (this.communicationDetails[field]) filledFields++;
  });
  
  this.completionStatus = Math.round((filledFields / totalFields) * 100);
  return this.completionStatus;
};

module.exports = mongoose.model('Profile', profileSchema);
