const mongoose = require('mongoose');
const fs = require('fs');
mongoose.connect('mongodb://localhost:27017/iit-ropar-admissions')
    .then(async () => {
        const users = await mongoose.connection.db.collection('users').find({}).toArray();
        fs.writeFileSync('users_dump.json', JSON.stringify(users, null, 2));
        console.log('Dumped users');
    })
    .finally(() => process.exit(0));
