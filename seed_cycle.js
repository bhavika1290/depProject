const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../server/.env') });

async function seedCycle() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const AdmissionCycle = mongoose.model('AdmissionCycle', new mongoose.Schema({
      name: String,
      startDate: Date,
      endDate: Date,
      isActive: Boolean,
      fees: Object
    }, { timestamps: true }));

    // Create a new active cycle
    const cycle = new AdmissionCycle({
      name: 'PhD Admission 2026',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-06-30'),
      isActive: true,
      fees: {
        GEN: 500,
        OBC: 500,
        EWS: 500,
        SC: 250,
        ST: 250,
        PWD: 250
      }
    });

    await cycle.save();
    console.log('Successfully seeded active admission cycle:', cycle.name);

    await mongoose.disconnect();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seedCycle();
