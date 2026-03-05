const Application = require('../models/Application.model');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

// @desc    Get user's applications
// @route   GET /api/applications/my-applications
// @access  Private (Student)
exports.getMyApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({ userId: req.user.id })
            .populate('offeringId', 'department specialization offeringType')
            .populate('admissionCycleId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new application
// @route   POST /api/applications
// @access  Private (Student)
exports.createApplication = async (req, res, next) => {
    try {
        req.body.userId = req.user.id;

        // Handle file uploads
        if (req.files) {
            if (req.files.transactionSlip) {
                req.body.paymentDetails = {
                    ...req.body.paymentDetails,
                    transactionSlip: req.files.transactionSlip[0].filename
                };
            }

            if (req.files.documents) {
                req.body.documents = {
                    ...req.body.documents,
                    other: req.files.documents.map(file => file.filename)
                };
            }
        }

        req.body.status = 'Submitted';
        req.body.submittedAt = Date.now();

        const application = await Application.create(req.body);

        res.status(201).json({
            success: true,
            data: application
        });
    } catch (error) {
        // Mongoose duplicate key for applicationId
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Application already exists' });
        }
        next(error);
    }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
exports.getApplicationById = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('userId', 'name email')
            .populate('offeringId')
            .populate('admissionCycleId');

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        // Ensure student can only view their own application
        if (req.user.role === 'student' && application.userId._id.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to access this application' });
        }

        res.status(200).json({
            success: true,
            data: application
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private (Admin, Faculty)
exports.getAllApplications = async (req, res, next) => {
    try {
        let query = {};

        // If faculty, optionally filter by department (assuming faculty has department in user model or similar)
        // Note: User model does not explicitly have department, so we fetch all or add custom logic later if needed
        // Assuming faculty views what they're assigned to in Offerings

        // Simple filtering based on query params
        if (req.query.offeringId) {
            query.offeringId = req.query.offeringId;
        }
        if (req.query.admissionCycleId) {
            query.admissionCycleId = req.query.admissionCycleId;
        }
        if (req.query.status) {
            query.status = req.query.status;
        }

        const applications = await Application.find(query)
            .populate('userId', 'name email')
            .populate('offeringId', 'department specialization')
            .populate('admissionCycleId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update application
// @route   PUT /api/applications/:id
// @access  Private (Admin)
exports.updateApplication = async (req, res, next) => {
    try {
        let application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        application = await Application.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: application
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Admin)
exports.updateApplicationStatus = async (req, res, next) => {
    try {
        const { status, remarks, result } = req.body;
        let application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        if (status) application.status = status;
        if (remarks) application.remarks = remarks;
        if (result) application.result = result;

        if (status || result) {
            application.reviewedAt = Date.now();
        }

        await application.save();

        res.status(200).json({
            success: true,
            data: application
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private (Admin)
exports.deleteApplication = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        await application.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Export applications
// @route   GET /api/applications/export/:cycleId/:offeringId
// @access  Private (Admin)
exports.exportApplications = async (req, res, next) => {
    try {
        const query = {};
        if (req.params.cycleId && req.params.cycleId !== 'all') {
            query.admissionCycleId = req.params.cycleId;
        }
        if (req.params.offeringId && req.params.offeringId !== 'all') {
            query.offeringId = req.params.offeringId;
        }

        const applications = await Application.find(query)
            .populate('userId', 'name email')
            .populate('offeringId', 'department specialization')
            .lean();

        if (applications.length === 0) {
            return res.status(404).json({ success: false, message: 'No applications found to export' });
        }

        // Format data for Excel
        const dataForExcel = applications.map(app => ({
            'Application ID': app.applicationId,
            'Applicant Name': app.personalDetails?.fullName || app.userId?.name || 'N/A',
            'Email': app.userId?.email || 'N/A',
            'Department': app.offeringId?.department || 'N/A',
            'Specialization': app.offeringId?.specialization || 'N/A',
            'Category': app.personalDetails?.category || 'N/A',
            'Status': app.status,
            'Result': app.result,
            'Submitted Date': app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'N/A'
        }));

        // Create a new workbook and add the worksheet
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(dataForExcel);
        xlsx.utils.book_append_sheet(wb, ws, 'Applications');

        // Generate buffer
        const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="applications_${Date.now()}.xlsx"`);
        res.send(buf);
    } catch (error) {
        next(error);
    }
};
