const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
  const User = require('./models/User.model');
  const Offering = require('./models/Offering.model');
  const Application = require('./models/Application.model');

  let output = '';

  const faculties = await User.find({ role: 'faculty' });
  output += '--- FACULTY ---\n';
  for (let f of faculties) {
    output += `[${f._id}] Name: ${f.name}, Email: ${f.email}\n`;
  }

  const apps = await Application.find().populate('offeringId');
  output += '\n--- APPLICATIONS ---\n';
  output += `Total Applications: ${apps.length}\n`;
  for (let app of apps) {
    output += `App ID: ${app._id}, Offering ID: ${app.offeringId?._id}, Faculty In Charge: ${app.offeringId?.facultyInCharge}\n`;
  }

  const offerings = await Offering.find();
  output += '\n--- OFFERINGS ---\n';
  output += `Total Offerings: ${offerings.length}\n`;
  for (let o of offerings) {
    output += `Offering ID: ${o._id}, Specialization: ${o.specialization}, Faculty In Charge: ${o.facultyInCharge}\n`;
  }
  
  fs.writeFileSync('db_output.json.txt', output);
  console.log("Done");
  process.exit();
});
