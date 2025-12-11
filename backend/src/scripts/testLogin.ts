import mongoose from 'mongoose';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const testAdminLogin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB\n');

    const testEmail = 'official.evolutiongadget@gmail.com';
    const testPassword = 'adminev34578@';

    console.log('=================================');
    console.log('Testing Admin Login');
    console.log('=================================');
    console.log('Email:', testEmail);
    console.log('Password:', testPassword);
    console.log();

    // Find user by email and include password
    const user = await User.findOne({ email: testEmail }).select('+password');

    if (!user) {
      console.log('❌ User not found!');
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log('✓ User found in database');
    console.log('  - ID:', user._id);
    console.log('  - Name:', user.name);
    console.log('  - Email:', user.email);
    console.log('  - Role:', user.role);
    console.log('  - Active:', user.isActive);
    console.log();

    // Test password comparison
    console.log('Testing password...');
    const isPasswordValid = await user.comparePassword(testPassword);
    
    if (isPasswordValid) {
      console.log('✓ Password is correct!\n');

      // Generate JWT token
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.log('❌ JWT_SECRET not found in environment variables!');
        await mongoose.disconnect();
        process.exit(1);
      }

      console.log('✓ JWT_SECRET found');
      
      const token = jwt.sign(
        {
          userId: user._id.toString(),
          email: user.email,
          role: user.role
        },
        jwtSecret,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any
      );

      console.log('✓ JWT token generated successfully\n');

      console.log('=================================');
      console.log('✅ LOGIN TEST SUCCESSFUL!');
      console.log('=================================');
      console.log('Token:', token.substring(0, 50) + '...');
      console.log('\nYou can now login with:');
      console.log('Email:', testEmail);
      console.log('Password:', testPassword);
      console.log('URL: http://localhost:3000/admin/login');
      console.log('=================================\n');

    } else {
      console.log('❌ Password is incorrect!');
      console.log('This might indicate a problem with password hashing.');
    }

    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

testAdminLogin();
