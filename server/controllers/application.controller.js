const Application = require('../models/Application.model');
const Profile = require('../models/Profile.model');
const PaymentTransaction = require('../models/PaymentTransaction.model');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const ALLOWED_FEE_CATEGORIES = ['GEN', 'OBC', 'SC', 'ST', 'PWD', 'EWS'];

const normalizeCategory = (category = '') => String(category).trim().toUpperCase();

const calculateApplicationFee = (category) => {
    const normalized = normalizeCategory(category);
    return normalized === 'GEN' || normalized === 'OBC' ? 500 : 250;
};

const getRazorpayClient = () => {
    const keyId = (process.env.RAZORPAY_KEY_ID || '').trim();
    const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();

    if (!keyId || !keySecret) {
        throw new Error('Razorpay keys are not configured on server');
    }

    if (!keyId.startsWith('rzp_')) {
        throw new Error('Invalid Razorpay key format in server configuration');
    }

    return new Razorpay({
        key_id: keyId,
        key_secret: keySecret
    });
};

const getReadableError = (error, fallbackMessage) => {
    const message = (
        error?.error?.description ||
        error?.description ||
        error?.message ||
        fallbackMessage
    );

    if (String(message).toLowerCase().includes('authentication failed')) {
        return 'Razorpay authentication failed. Please verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env and restart server.';
    }

    return (
        message
    );
};

// @desc    Get user's applications
// @route   GET /api/applications/my-applications
// @access  Private (Student)
exports.getMyApplications = async (req, res, next) => {
    try {
        console.log('Fetching applications for user:', req.user.id);
        const applications = await Application.find({ userId: req.user.id })
            .populate('offeringId', 'department specialization offeringType')
            .populate('admissionCycleId', 'name')
            .sort({ createdAt: -1 });
        
        console.log('Found applications:', applications.length);

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
        console.log('--- APPLICATION SUBMISSION START ---');
        console.log('User ID:', req.user.id);
        req.body.userId = req.user.id;

        // Ensure complex nested objects sent via FormData are parsed back to JSON
        const fieldsToParse = ['generalApplicationDetails', 'personalDetails', 'communicationDetails', 'educationalDetails', 'qualifyingExams', 'experienceDetails', 'publications', 'paymentDetails'];
        
        fieldsToParse.forEach(field => {
            if (req.body[field] && typeof req.body[field] === 'string') {
                try {
                    req.body[field] = JSON.parse(req.body[field]);
                } catch (e) {
                    console.error(`Failed to parse ${field}:`, e);
                }
            }
        });

        const requestedCategory = req.body.paymentDetails?.category;
        const normalizedCategory = normalizeCategory(requestedCategory);
        const allowedCategory = ALLOWED_FEE_CATEGORIES.includes(normalizedCategory);

        if (!allowedCategory) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment category selected'
            });
        }

        const expectedAmount = calculateApplicationFee(normalizedCategory);
        const {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            paymentStatus
        } = req.body.paymentDetails || {};

        if (
            paymentStatus !== 'Completed' ||
            !razorpayOrderId ||
            !razorpayPaymentId ||
            !razorpaySignature
        ) {
            return res.status(400).json({
                success: false,
                message: 'Complete online fee payment before submitting application'
            });
        }

        const verifiedPayment = await PaymentTransaction.findOne({
            userId: req.user.id,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            paymentStatus: 'Completed'
        });

        if (!verifiedPayment) {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed. Please retry payment.'
            });
        }

        req.body.paymentDetails = {
            ...(req.body.paymentDetails || {}),
            category: normalizedCategory,
            amount: expectedAmount,
            paymentStatus: 'Completed',
            transactionId: razorpayPaymentId,
            bank: 'Razorpay'
        };

        // Fetch User Profile to fill in details if missing
        const profile = await Profile.findOne({ userId: req.user.id });
        if (profile) {
            if (!req.body.personalDetails && profile.personalInfo) {
                req.body.personalDetails = {
                    fullName: profile.personalInfo.fullName,
                    fatherName: profile.personalInfo.fatherName,
                    dateOfBirth: profile.personalInfo.dateOfBirth,
                    gender: profile.personalInfo.gender,
                    nationality: profile.personalInfo.nationality,
                    category: profile.personalInfo.category,
                    aadhaarNumber: profile.personalInfo.aadhaarNumber,
                    maritalStatus: profile.personalInfo.maritalStatus,
                    isPWD: profile.personalInfo.isPWD,
                    profilePhoto: profile.personalInfo.profilePhoto
                };
            }
            if (!req.body.communicationDetails && profile.communicationDetails) {
                req.body.communicationDetails = profile.communicationDetails;
            }
            if (!req.body.educationalDetails && profile.educationalDetails) {
                req.body.educationalDetails = {
                    tenth: {
                        school: profile.educationalDetails.tenthSchool,
                        board: profile.educationalDetails.tenthBoard,
                        year: profile.educationalDetails.tenthYear,
                        percentage: profile.educationalDetails.tenthPercentage
                    },
                    twelfth: {
                        school: profile.educationalDetails.twelfthSchool,
                        board: profile.educationalDetails.twelfthBoard,
                        year: profile.educationalDetails.twelfthYear,
                        percentage: profile.educationalDetails.twelfthPercentage
                    },
                    ug: {
                        college: profile.educationalDetails.ugCollege,
                        university: profile.educationalDetails.ugUniversity,
                        degree: profile.educationalDetails.ugDegree,
                        specialization: profile.educationalDetails.ugSpecialization,
                        year: profile.educationalDetails.ugYear,
                        cgpa: profile.educationalDetails.ugCGPA
                    },
                    pg: {
                        college: profile.educationalDetails.pgCollege,
                        university: profile.educationalDetails.pgUniversity,
                        degree: profile.educationalDetails.pgDegree,
                        specialization: profile.educationalDetails.pgSpecialization,
                        year: profile.educationalDetails.pgYear,
                        cgpa: profile.educationalDetails.pgCGPA
                    }
                };
            }
        }

        // Handle file uploads
        if (req.files) {
            if (req.files.transactionSlip) {
                req.body.paymentDetails = {
                    ...(req.body.paymentDetails || {}),
                    transactionSlip: req.files.transactionSlip[0].filename
                };
            }

            if (req.files.documents) {
                req.body.documents = {
                    ...(req.body.documents || {}),
                    other: req.files.documents.map(file => file.filename)
                };
            }
        }

        req.body.status = 'Submitted';
        req.body.submittedAt = Date.now();

        // Ensure boolean conversion for declaration
        if (req.body.declarationAccepted === 'true') {
            req.body.declarationAccepted = true;
        }

        // Auto-fill admissionCycleId if not provided by frontend
        if (!req.body.admissionCycleId && req.body.offeringId) {
            const mongoose = require('mongoose');
            const offering = await mongoose.model('Offering').findById(req.body.offeringId);
            if (offering && offering.admissionCycleId) {
                req.body.admissionCycleId = offering.admissionCycleId;
            }
        }

        console.log('Submitting data to Mongoose:', req.body);

        const application = await Application.create(req.body);

        console.log('--- APPLICATION SUBMISSION SUCCESS ---');
        res.status(201).json({
            success: true,
            data: application
        });
    } catch (error) {
        console.error('--- APPLICATION SUBMISSION FAILED ---');
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
        console.error('Full Error:', error);

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

// @desc    Create Razorpay order
// @route   POST /api/applications/create-order
// @access  Private (Student)
exports.createOrder = async (req, res, next) => {
    try {
        const { category } = req.body;
        const normalizedCategory = normalizeCategory(category);

        if (!ALLOWED_FEE_CATEGORIES.includes(normalizedCategory)) {
            return res.status(400).json({
                success: false,
                message: 'Please select a valid category'
            });
        }

        const razorpay = getRazorpayClient();
        const amount = calculateApplicationFee(normalizedCategory);

        // Razorpay receipt has a max length of 40 chars.
        const shortUserId = String(req.user.id).slice(-8);
        const receipt = `fee_${shortUserId}_${Date.now()}`;

        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: 'INR',
            receipt,
            notes: {
                userId: String(req.user.id),
                category: normalizedCategory
            }
        });

        console.log('Razorpay create-order success:', {
            userId: req.user.id,
            category: normalizedCategory,
            amount,
            amountInPaise: amount * 100,
            currency: order.currency,
            orderId: order.id
        });

        await PaymentTransaction.create({
            userId: req.user.id,
            category: normalizedCategory,
            amount,
            paymentStatus: 'Pending',
            razorpayOrderId: order.id
        });

        res.status(201).json({
            success: true,
            data: {
                key: process.env.RAZORPAY_KEY_ID,
                orderId: order.id,
                amount,
                currency: order.currency,
                user: {
                    name: req.user.name || '',
                    email: req.user.email || ''
                }
            }
        });
    } catch (error) {
        console.error('Razorpay create-order error:', error);
        res.status(error?.statusCode || 400).json({
            success: false,
            message: getReadableError(error, 'Failed to create payment order')
        });
    }
};

// @desc    Verify Razorpay payment
// @route   POST /api/applications/verify-payment
// @access  Private (Student)
exports.verifyPayment = async (req, res, next) => {
    try {
        const {
            category,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        console.log('Razorpay verify-payment request:', {
            userId: req.user.id,
            category,
            razorpay_order_id,
            razorpay_payment_id
        });

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Incomplete payment data'
            });
        }

        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            await PaymentTransaction.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id, userId: req.user.id },
                { paymentStatus: 'Failed' }
            );

            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }

        const normalizedCategory = normalizeCategory(category);
        if (!ALLOWED_FEE_CATEGORIES.includes(normalizedCategory)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment category'
            });
        }
        const amount = calculateApplicationFee(normalizedCategory);

        const paymentRecord = await PaymentTransaction.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id, userId: req.user.id },
            {
                category: normalizedCategory,
                amount,
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                paymentStatus: 'Completed',
                paidAt: new Date()
            },
            { new: true }
        );

        if (!paymentRecord) {
            return res.status(404).json({
                success: false,
                message: 'Payment order not found for this user'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            data: {
                category: paymentRecord.category,
                amount: paymentRecord.amount,
                paymentStatus: paymentRecord.paymentStatus,
                transactionDate: paymentRecord.paidAt,
                razorpayOrderId: paymentRecord.razorpayOrderId,
                razorpayPaymentId: paymentRecord.razorpayPaymentId,
                razorpaySignature: paymentRecord.razorpaySignature
            }
        });
    } catch (error) {
        console.error('Razorpay verify-payment error:', error);
        res.status(error?.statusCode || 400).json({
            success: false,
            message: getReadableError(error, 'Failed to verify payment')
        });
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
        if (req.query.facultyId) {
            const mongoose = require('mongoose');
            const offerings = await mongoose.model('Offering').find({ facultyInCharge: req.query.facultyId }).select('_id');
            const offeringIds = offerings.map(o => o._id);
            if (query.offeringId) {
                // If offeringId is already specified, ensure it belongs to this faculty
                if (!offeringIds.some(id => id.toString() === query.offeringId.toString())) {
                    return res.status(200).json({ success: true, count: 0, data: [] });
                }
            } else {
                query.offeringId = { $in: offeringIds };
            }
        }

        const applications = await Application.find(query)
            .populate('userId', 'name email')
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
