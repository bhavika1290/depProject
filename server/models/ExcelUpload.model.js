const mongoose = require('mongoose');

const excelUploadSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  admissionCycleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdmissionCycle'
  },
  offeringId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offering'
  },
  totalRecords: {
    type: Number,
    default: 0
  },
  processedRecords: {
    type: Number,
    default: 0
  },
  successfulEmails: {
    type: Number,
    default: 0
  },
  failedEmails: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Uploaded', 'Processing', 'Completed', 'Failed'],
    default: 'Uploaded'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ExcelUpload', excelUploadSchema);
