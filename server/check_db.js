const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
  const User = require('./models/User.model');
  const Offering = require('./models/Offering.model');
  const Application = require('./models/Application.model');

  const faculty = await User.findOne({ email: 'bhavika.1290@gmail.com' });
  console.log('Faculty ID:', faculty ? faculty._id : 'Not Found');

  const apps = await Application.find().populate('offeringId');
  console.log('Total Applications:', apps.length);
  for (let app of apps) {
    console.log(`App ID: ${app._id}, Offering ID: ${app.offeringId?._id}, Faculty In Charge: ${app.offeringId?.facultyInCharge}`);
  }

  const offerings = await Offering.find();
  console.log('Total Offerings:', offerings.length);
  for (let o of offerings) {
    console.log(`Offering ID: ${o._id}, Specialization: ${o.specialization}, Faculty In Charge: ${o.facultyInCharge}`);
  }
  
  process.exit();
});
