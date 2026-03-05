const Template = require('../models/Template.model');

// @desc    Get all templates
// @route   GET /api/templates
// @access  Private (Admin, Faculty)
exports.getAllTemplates = async (req, res, next) => {
    try {
        const templates = await Template.find().populate('createdBy', 'name email').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: templates.length,
            data: templates
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single template
// @route   GET /api/templates/:id
// @access  Private (Admin, Faculty)
exports.getTemplateById = async (req, res, next) => {
    try {
        const template = await Template.findById(req.params.id).populate('createdBy', 'name email');

        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found' });
        }

        res.status(200).json({
            success: true,
            data: template
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new template
// @route   POST /api/templates
// @access  Private (Admin)
exports.createTemplate = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.createdBy = req.user.id;

        const template = await Template.create(req.body);

        res.status(201).json({
            success: true,
            data: template
        });
    } catch (error) {
        // Mongoose duplicate key
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Template name already exists' });
        }
        next(error);
    }
};

// @desc    Update template
// @route   PUT /api/templates/:id
// @access  Private (Admin)
exports.updateTemplate = async (req, res, next) => {
    try {
        let template = await Template.findById(req.params.id);

        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found' });
        }

        if (template.scope === 'DEFAULT' && req.body.name && req.body.name !== template.name) {
            return res.status(400).json({ success: false, message: 'Cannot rename DEFAULT templates' });
        }

        template = await Template.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: template
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete template
// @route   DELETE /api/templates/:id
// @access  Private (Admin)
exports.deleteTemplate = async (req, res, next) => {
    try {
        const template = await Template.findById(req.params.id);

        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found' });
        }

        if (template.scope === 'DEFAULT') {
            return res.status(400).json({ success: false, message: 'Cannot delete DEFAULT templates' });
        }

        await template.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
