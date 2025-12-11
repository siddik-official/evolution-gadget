import mongoose from 'mongoose';
import { User } from '../models/User';
import { UserRole } from '../types';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@evulation.com' });
    
    if (existingAdmin) {
      console.log('⚠ Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Name:', existingAdmin.name);
      console.log('Role:', existingAdmin.role);
      
      // Update password if needed
      console.log('\nUpdating admin password...');
      existingAdmin.password = 'adminev34578@';
      await existingAdmin.save();
      console.log('✓ Admin password updated successfully!');
    } else {
      // Create new admin user
      console.log('Creating new admin user...');
      
      const adminUser = new User({
        name: 'admin-evolution987',
        email: 'admin@evulation.com',
        password: 'adminev34578@',
        role: UserRole.ADMIN,
        isActive: true,
        phone: '+1234567890',
        address: {
          street: '123 Admin Street',
          city: 'Admin City',
          state: 'Admin State',
          country: 'USA',
          zipCode: '12345'
        }
      });

      await adminUser.save();
      console.log('✓ Admin user created successfully!');
    }

    console.log('\n=================================');
    console.log('Admin Credentials:');
    console.log('=================================');
    console.log('Username: admin-evolution987');
    console.log('Email: official.evolutiongadget@gmail.com');
    console.log('Password: adminev34578@');
    console.log('Role: ADMIN');
    console.log('=================================\n');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run the script
createAdminUser();
