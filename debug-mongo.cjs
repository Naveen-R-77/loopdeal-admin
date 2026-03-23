require('dotenv').config();
const mongoose = require('mongoose');

const testUris = [
  process.env.MONGODB_URI,
  'mongodb+srv://naveengowtham178_db_user:admin12345@loopdeal.avrcwo0.mongodb.net/admin?retryWrites=true&w=majority',
  'mongodb+srv://naveengowtham178_db_user:admin12345@loopdeal.avrcwo0.mongodb.net/?retryWrites=true&w=majority'
];

async function runTests() {
  for (const uri of testUris) {
    try {
      console.log('Testing URI:', uri.replace(/:[^:]*@/, ':****@'));
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log('--- SUCCESS: CONNECTED! ---');
      await mongoose.disconnect();
      return;
    } catch (e) {
      console.log('--- FAILED ---');
      console.error(e.message);
    }
  }
}

runTests();
