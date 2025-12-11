import mongoose from 'mongoose';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const testAdminPassword = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB\n');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@evulation.com' }).select('+password');
    
    if (!admin) {
      console.log('❌ Admin user not found!');
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log('=================================');
    console.log('Admin User Found:');
    console.log('=================================');
    console.log('Email:', admin.email);
    console.log('Name:', admin.name);
    console.log('Role:', admin.role);
    console.log('Active:', admin.isActive);
    console.log('Hashed Password:', admin.password?.substring(0, 20) + '...');
    console.log('Password Hash Length:', admin.password?.length);

    // Test password
    const testPassword = 'adminev34578@';
    console.log('\n=================================');
    console.log('Testing Password:');
    console.log('=================================');
    console.log('Test Password:', testPassword);
    
    // Test using the model's comparePassword method
    if (admin.password) {
      const isValidMethod = await admin.comparePassword(testPassword);
      console.log('Using comparePassword method:', isValidMethod ? '✓ VALID' : '❌ INVALID');
      
      // Test using bcrypt directly
      const isValidDirect = await bcrypt.compare(testPassword, admin.password);
      console.log('Using bcrypt.compare directly:', isValidDirect ? '✓ VALID' : '❌ INVALID');
      
      if (!isValidMethod || !isValidDirect) {
        console.log('\n⚠️  Password mismatch detected!');
        console.log('Updating password to:', testPassword);
        
        // Manually hash and update
        const newHash = await bcrypt.hash(testPassword, 12);
        console.log('New hash:', newHash.substring(0, 20) + '...');
        
        // Update directly in database
        await User.updateOne(
          { email: 'admin@evulation.com' },
          { $set: { password: newHash } }
        );
        
        console.log('✓ Password updated directly in database');
        
        // Verify again
        const updatedAdmin = await User.findOne({ email: 'admin@evulation.com' }).select('+password');
        if (updatedAdmin && updatedAdmin.password) {
          const isValidAfterUpdate = await bcrypt.compare(testPassword, updatedAdmin.password);
          console.log('Verification after update:', isValidAfterUpdate ? '✓ VALID' : '❌ INVALID');
        }
      }
    }

    console.log('\n=================================');
    console.log('✅ Login Credentials:');
    console.log('=================================');
    console.log('Email:    admin@evulation.com');
    console.log('Password: adminev34578@');
    console.log('=================================\n');

    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

testAdminPassword();
