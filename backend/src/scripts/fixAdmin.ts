import mongoose from 'mongoose';
import { User } from '../models/User';
import { UserRole } from '../types';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const checkAndFixAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB\n');

    // Find admin user
    const admin = await User.findOne({ role: UserRole.ADMIN }).select('+password');

    if (!admin) {
      console.log('❌ No admin user found!');
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log('=================================');
    console.log('Current Admin User in Database:');
    console.log('=================================');
    console.log('ID:', admin._id);
    console.log('Name:', admin.name);
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Active:', admin.isActive);
    console.log('Password Hash:', admin.password?.substring(0, 20) + '...');
    console.log();

    // Test current password
    console.log('Testing password: adminev34578@');
    const isValid = await bcrypt.compare('adminev34578@', admin.password!);
    console.log('Password valid?', isValid);
    console.log();

    if (!isValid) {
      console.log('⚠ Password does not match! Resetting...\n');
      
      // Manually hash the password to ensure it's correct
      const hashedPassword = await bcrypt.hash('adminev34578@', 12);
      
      // Update directly without triggering pre-save hook
      await User.updateOne(
        { _id: admin._id },
        { 
          $set: { 
            password: hashedPassword,
            email: 'official.evolutiongadget@gmail.com',
            name: 'admin-evolution987',
            isActive: true
          } 
        }
      );

      console.log('✓ Password reset successfully!\n');

      // Verify the update
      const updatedAdmin = await User.findById(admin._id).select('+password');
      const isNewValid = await bcrypt.compare('adminev34578@', updatedAdmin!.password!);
      console.log('New password valid?', isNewValid);
    }

    console.log('\n=================================');
    console.log('✅ ADMIN LOGIN CREDENTIALS');
    console.log('=================================');
    console.log('Email:    official.evolutiongadget@gmail.com');
    console.log('Password: adminev34578@');
    console.log('=================================');
    console.log('\n⚠ IMPORTANT: Copy and paste these EXACTLY!');
    console.log('Make sure there are no extra spaces!\n');

    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

checkAndFixAdmin();
