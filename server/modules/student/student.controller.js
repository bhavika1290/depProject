// Student Feature Controller
exports.getProfile = async (req, res) => {
  res.status(200).json({ success: true, message: 'Student Profile active' });
};
