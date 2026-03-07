const User = require('../../models/User.model');
const jwt = require('jsonwebtoken');

// Stub email sender for OTP console logging (will replace with real nodemailer later)
const sendOTP = (email, otp) => {
  console.log(`\n\n[MOCK EMAIL to ${email}] -> Your OTP is: ${otp}\n\n`);
};

// Generate JWT Helper
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: '7d',
  });
};

/* =======================================
   REGISTER FLOW: 1. Submit Credentials
   ======================================= */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!['student', 'faculty', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role selected.' });
    }

    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }
    
    // Clear unverified legacy attempts
    if (user && !user.isVerified) {
      await User.findByIdAndDelete(user._id);
    }

    user = await User.create({ name, email, password, role, isVerified: false });
    
    const otp = user.generateOTP();
    await user.save();
    
    sendOTP(email, otp); // Send email

    res.status(200).json({ 
      success: true, 
      message: 'OTP sent to email. Please verify to complete registration.',
      data: { email } 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =======================================
   REGISTER FLOW: 2. Verify OTP
   ======================================= */
exports.verifyRegistrationOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email }).select('+otp +otpExpire');

    if (!user) return res.status(400).json({ success: false, message: 'User not found.' });
    if (user.isVerified) return res.status(400).json({ success: false, message: 'Already verified.' });
    if (!user.otp || user.otpExpire < Date.now()) return res.status(400).json({ success: false, message: 'OTP expired.' });
    if (user.otp !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP.' });

    // Mark verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Registration successful!',
      token,
      data: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =======================================
   LOGIN FLOW: 1. Verify Credentials
   ======================================= */
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    if (user.role !== role) return res.status(403).json({ success: false, message: `Access denied. You are not a registered ${role}.` });
    if (!user.isVerified) return res.status(401).json({ success: false, message: 'Email not verified.' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    const otp = user.generateOTP();
    await user.save();

    sendOTP(email, otp);

    res.status(200).json({ 
      success: true, 
      message: 'OTP sent! Please verify your login.',
      data: { email }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =======================================
   LOGIN FLOW: 2. Verify OTP
   ======================================= */
exports.verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email }).select('+otp +otpExpire');

    if (!user) return res.status(400).json({ success: false, message: 'User not found.' });
    if (!user.otp || user.otpExpire < Date.now()) return res.status(400).json({ success: false, message: 'OTP expired.' });
    if (user.otp !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP.' });

    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      data: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
