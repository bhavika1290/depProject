const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  recipientEmail: {
    type: String,
    required: true
  },
  recipientName: String,
  subject: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  templateUsed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template'
  },
  status: {
    type: String,
    enum: ['Sent', 'Failed', 'Pending'],
    default: 'Pending'
  },
  errorMessage: String,
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  excelFileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExcelUpload'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('EmailLog', emailLogSchema);
