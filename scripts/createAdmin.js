const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now },
});

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    const adminData = {
      name: 'Admin',
      email: 'admin@teamname.com',
      password: await bcrypt.hash('YourStrongPassword123!', 10),
      role: 'admin',
    };

    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const admin = await User.create(adminData);
    console.log('Admin created successfully:', admin.email);
    console.log('Password: YourStrongPassword123!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();