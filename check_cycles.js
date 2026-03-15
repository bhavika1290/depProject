const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../server/.env') });

const AdmissionCycle = require('./server/models/AdmissionCycle.model');

async function checkCycles() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const cycles = await AdmissionCycle.find();
    console.log(`Found ${cycles.length} admission cycles:`);
    cycles.forEach((c, i) => {
      console.log(`${i+1}. name: ${c.name}, isActive: ${c.isActive}, id: ${c._id}`);
    });

    if (cycles.length > 0 && !cycles.some(c => c.isActive)) {
      console.log('\nACTIVATE ONE: No active cycle found. You can activate one using:');
      console.log(`db.admissioncycles.updateOne({_id: ObjectId("${cycles[0]._id}")}, {$set: {isActive: true}})`);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkCycles();
