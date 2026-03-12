const Application = require('../models/Application.model');
const AdmissionCycle = require('../models/AdmissionCycle.model');
const Offering = require('../models/Offering.model');

// @desc    Get Admin/Faculty dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private (Admin, Faculty)
exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalApplications = await Application.countDocuments();

        // Get active cycle
        const activeCycle = await AdmissionCycle.findOne({ isActive: true });

        // Count offerings only for the active cycle if it exists, otherwise count all
        const offeringQuery = activeCycle ? { admissionCycleId: activeCycle._id } : {};
        const totalOfferings = await Offering.countDocuments(offeringQuery);

        const totalCycles = await AdmissionCycle.countDocuments();

        // Get recent applications
        const recentApplications = await Application.find()
            .sort({ submittedAt: -1 })
            .limit(5)
            .populate('userId', 'name email')
            .populate('offeringId', 'department');

        // Get category stats for charts
        const catStats = await Application.aggregate([
            {
                $group: {
                    _id: '$personalDetails.category',
                    count: { $sum: 1 }
                }
            }
        ]);

        const categoryStats = [
            { name: 'GEN', Applications: 0 },
            { name: 'EWS', Applications: 0 },
            { name: 'OBC', Applications: 0 },
            { name: 'SC', Applications: 0 },
            { name: 'ST', Applications: 0 }
        ].map(cat => {
            const found = catStats.find(s => s._id === cat.name);
            return { ...cat, Applications: found ? found.count : 0 };
        });

        // Get gender stats for charts
        const genStats = await Application.aggregate([
            {
                $group: {
                    _id: '$personalDetails.gender',
                    count: { $sum: 1 }
                }
            }
        ]);

        const genderStats = [
            { name: 'Male', Applications: 0 },
            { name: 'Female', Applications: 0 },
            { name: 'Other', Applications: 0 }
        ].map(gen => {
            const found = genStats.find(s => s._id === gen.name);
            return { ...gen, Applications: found ? found.count : 0 };
        });

        res.status(200).json({
            success: true,
            data: {
                totalApplications,
                totalOfferings,
                totalCycles,
                recentApplications,
                activeCycle: activeCycle || null,
                categoryStats,
                genderStats
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
