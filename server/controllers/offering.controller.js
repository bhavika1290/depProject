const Offering = require('../models/Offering.model');

// @desc    Get all offerings
// @route   GET /api/offerings
// @access  Public
exports.getAllOfferings = async (req, res, next) => {
    try {
        const offerings = await Offering.find()
            .populate('admissionCycleId', 'name duration isActive')
            .populate('facultyInCharge', 'name email department')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: offerings.length,
            data: offerings
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get open offerings
// @route   GET /api/offerings/open
// @access  Public
exports.getOpenOfferings = async (req, res, next) => {
    try {
        const now = new Date();
        // Auto-update status based on deadline is handled in pre('find') hook in Offering model
        const offerings = await Offering.find({ status: 'Open', deadline: { $gt: now } })
            .populate('admissionCycleId', 'name duration isActive duration');

        res.status(200).json({
            success: true,
            count: offerings.length,
            data: offerings
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single offering
// @route   GET /api/offerings/:id
// @access  Public
exports.getOfferingById = async (req, res, next) => {
    try {
        const offering = await Offering.findById(req.params.id)
            .populate('admissionCycleId')
            .populate('facultyInCharge', 'name email department');

        if (!offering) {
            return res.status(404).json({ success: false, message: 'Offering not found' });
        }

        res.status(200).json({
            success: true,
            data: offering
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new offering
// @route   POST /api/offerings
// @access  Private (Admin)
exports.createOffering = async (req, res, next) => {
    try {
        const offering = await Offering.create(req.body);

        res.status(201).json({
            success: true,
            data: offering
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update offering
// @route   PUT /api/offerings/:id
// @access  Private (Admin)
exports.updateOffering = async (req, res, next) => {
    try {
        let offering = await Offering.findById(req.params.id);

        if (!offering) {
            return res.status(404).json({ success: false, message: 'Offering not found' });
        }

        offering = await Offering.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: offering
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete offering
// @route   DELETE /api/offerings/:id
// @access  Private (Admin)
exports.deleteOffering = async (req, res, next) => {
    try {
        const offering = await Offering.findById(req.params.id);

        if (!offering) {
            return res.status(404).json({ success: false, message: 'Offering not found' });
        }

        await offering.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Publish results
// @route   PUT /api/offerings/:id/publish-results
// @access  Private (Admin)
exports.publishResults = async (req, res, next) => {
    try {
        let offering = await Offering.findById(req.params.id);

        if (!offering) {
            return res.status(404).json({ success: false, message: 'Offering not found' });
        }

        offering.resultsPublished = true;
        await offering.save();

        res.status(200).json({
            success: true,
            data: offering
        });
    } catch (error) {
        next(error);
    }
};
