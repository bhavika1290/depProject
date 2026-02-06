const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Template name is required'],
    unique: true,
    trim: true
  },
  scope: {
    type: String,
    enum: ['DEFAULT', 'CUSTOM'],
    default: 'DEFAULT'
  },
  type: {
    type: String,
    enum: ['APPLICANT LIST', 'EMAIL', 'DOCUMENT'],
    default: 'APPLICANT LIST'
  },
  content: {
    type: String
  },
  subject: {
    type: String
  },
  // For email templates
  emailBody: {
    type: String
  },
  // Variables that can be used in template
  variables: [{
    name: String,
    description: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Template', templateSchema);
