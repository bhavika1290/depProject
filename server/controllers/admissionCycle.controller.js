const AdmissionCycle = require('../models/AdmissionCycle.model');

// @desc    Get all admission cycles
// @route   GET /api/admission-cycles
// @access  Public
exports.getAllCycles = async (req, res) => {
  try {
    const cycles = await AdmissionCycle.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: cycles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get active cycle
// @route   GET /api/admission-cycles/active
// @access  Public
exports.getActiveCycle = async (req, res) => {
  try {
    const cycle = await AdmissionCycle.findOne({ isActive: true });
    if (!cycle) return res.status(404).json({ success: false, message: 'No active admission cycle' });
    res.status(200).json({ success: true, data: cycle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get cycle by id
// @route   GET /api/admission-cycles/:id
// @access  Public
exports.getCycleById = async (req, res) => {
  try {
    const cycle = await AdmissionCycle.findById(req.params.id);
    if (!cycle) return res.status(404).json({ success: false, message: 'Admission cycle not found' });
    res.status(200).json({ success: true, data: cycle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new admission cycle
// @route   POST /api/admission-cycles
// @access  Admin
exports.createCycle = async (req, res) => {
  try {
    const payload = { ...req.body, createdBy: req.user.id };
    const cycle = await AdmissionCycle.create(payload);
    res.status(201).json({ success: true, message: 'Admission cycle created', data: cycle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an admission cycle
// @route   PUT /api/admission-cycles/:id
// @access  Admin
exports.updateCycle = async (req, res) => {
  try {
    const cycle = await AdmissionCycle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!cycle) return res.status(404).json({ success: false, message: 'Admission cycle not found' });
    res.status(200).json({ success: true, message: 'Admission cycle updated', data: cycle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an admission cycle
// @route   DELETE /api/admission-cycles/:id
// @access  Admin
exports.deleteCycle = async (req, res) => {
  try {
    const cycle = await AdmissionCycle.findById(req.params.id);
    if (!cycle) return res.status(404).json({ success: false, message: 'Admission cycle not found' });
    await cycle.deleteOne();
    res.status(200).json({ success: true, message: 'Admission cycle deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Activate an admission cycle (set isActive true and others false via model pre-save)
// @route   PUT /api/admission-cycles/:id/activate
// @access  Admin
exports.activateCycle = async (req, res) => {
  try {
    const cycle = await AdmissionCycle.findById(req.params.id);
    if (!cycle) return res.status(404).json({ success: false, message: 'Admission cycle not found' });
    cycle.isActive = true;
    await cycle.save();
    res.status(200).json({ success: true, message: 'Admission cycle activated', data: cycle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
