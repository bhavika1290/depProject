const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
  const User = require('./models/User.model');
  const Offering = require('./models/Offering.model');
  const Application = require('./models/Application.model');

  const faculties = await User.find({ role: 'faculty' });
  console.log('--- FACULTY ---');
  for (let f of faculties) {
    console.log(`[${f._id}] Name: ${f.name}, Email: ${f.email}`);
  }

  const apps = await Application.find().populate('offeringId');
  console.log('\n--- APPLICATIONS ---');
  console.log(`Total Applications: ${apps.length}`);
  for (let app of apps) {
    console.log(`App ID: ${app._id}, Offering ID: ${app.offeringId?._id}, Faculty In Charge: ${app.offeringId?.facultyInCharge}`);
  }

  const offerings = await Offering.find();
  console.log('\n--- OFFERINGS ---');
  console.log(`Total Offerings: ${offerings.length}`);
  for (let o of offerings) {
    console.log(`Offering ID: ${o._id}, Specialization: ${o.specialization}, Faculty In Charge: ${o.facultyInCharge}`);
  }
  
  process.exit();
});
