const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
  const User = require('./models/User.model');
  const Offering = require('./models/Offering.model');

  const faculties = await User.find({ role: 'faculty' });
  const facultyIds = faculties.map(f => f._id);
  
  const offerings = await Offering.find({ facultyInCharge: { $exists: true, $size: 0 } });
  const allOfferings = await Offering.find(); // Fallback if size: 0 doesn't match empty array or missing field
  
  let updatedCount = 0;
  for (let o of allOfferings) {
    if (!o.facultyInCharge || o.facultyInCharge.length === 0) {
      o.facultyInCharge = facultyIds;
      await o.save();
      updatedCount++;
      console.log(`Updated Offering ${o._id}`);
    }
  }
  
  console.log(`Updated ${updatedCount} offerings.`);
  process.exit();
});
