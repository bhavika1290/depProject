const Application = require('../models/Application.model');
const AdmissionCycle = require('../models/AdmissionCycle.model');
const Offering = require('../models/Offering.model');

// @desc    Get Admin/Faculty dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private (Admin, Faculty)
exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalApplications = await Application.countDocuments();
        const totalOfferings = await Offering.countDocuments();
        const totalCycles = await AdmissionCycle.countDocuments();

        // Get recent applications
        const recentApplications = await Application.find()
            .sort({ submittedAt: -1 })
            .limit(5)
            .populate('userId', 'name email')
            .populate('offeringId', 'department');

        res.status(200).json({
            success: true,
            data: {
                totalApplications,
                totalOfferings,
                totalCycles,
                recentApplications
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get category-wise applications count
// @route   GET /api/dashboard/category-wise
// @access  Private (Admin)
exports.getCategoryWiseApplications = async (req, res, next) => {
    try {
        const stats = await Application.aggregate([
            {
                $group: {
                    _id: '$personalDetails.category',
                    count: { $sum: 1 }
                }
            },
            {
                $match: {
                    _id: { $ne: null }
                }
            }
        ]);

        const formattedStats = stats.map(item => ({
            name: item._id || 'Not Specified',
            value: item.count
        }));

        res.status(200).json({
            success: true,
            data: formattedStats
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get gender-wise applications count
// @route   GET /api/dashboard/gender-wise
// @access  Private (Admin)
exports.getGenderWiseApplications = async (req, res, next) => {
    try {
        const stats = await Application.aggregate([
            {
                $group: {
                    _id: '$personalDetails.gender',
                    count: { $sum: 1 }
                }
            },
            {
                $match: {
                    _id: { $ne: null }
                }
            }
        ]);

        const formattedStats = stats.map(item => ({
            name: item._id || 'Not Specified',
            value: item.count
        }));

        res.status(200).json({
            success: true,
            data: formattedStats
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get student dashboard
// @route   GET /api/dashboard/student-stats
// @access  Private (Student)
exports.getStudentDashboard = async (req, res, next) => {
    try {
        const applications = await Application.find({ userId: req.user.id });
        const submittedCount = applications.length;
        const acceptedCount = applications.filter(app => app.result === 'Selected').length;
        const shortlistedCount = applications.filter(app => app.status === 'Shortlisted').length;

        // Open admission cycles count
        const openOfferings = await Offering.countDocuments({ status: 'Open', deadline: { $gt: new Date() } });

        res.status(200).json({
            success: true,
            data: {
                submittedCount,
                acceptedCount,
                shortlistedCount,
                openOfferings
            }
        });
    } catch (error) {
        next(error);
    }
};
