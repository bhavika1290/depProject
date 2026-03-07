// Admin Feature Controller
exports.getStats = async (req, res) => {
  res.status(200).json({ success: true, message: 'Admin Stats active' });
};
