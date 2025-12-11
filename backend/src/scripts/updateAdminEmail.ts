import mongoose from 'mongoose';
import { User } from '../models/User';
import { UserRole } from '../types';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const updateAdminEmail = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB successfully!');

    // Find admin user by role
    const adminUser = await User.findOne({ role: UserRole.ADMIN }).select('+password');
    
    if (!adminUser) {
      console.log('❌ No admin user found!');
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log('\n=================================');
    console.log('Current admin user:');
    console.log('=================================');
    console.log('Name:', adminUser.name);
    console.log('Email:', adminUser.email);
    console.log('Role:', adminUser.role);

    // Update email and ensure password is correct
    console.log('\n🔄 Updating admin credentials...');
    adminUser.email = 'official.evolutiongadget@gmail.com';
    adminUser.name = 'admin-evolution987';
    adminUser.password = 'adminev34578@';
    adminUser.isActive = true;
    
    await adminUser.save();
    console.log('✓ Admin user updated successfully!');

    // Verify the update
    const verifyAdmin = await User.findOne({ email: 'official.evolutiongadget@gmail.com' });
    
    console.log('\n=================================');
    console.log('✅ UPDATED ADMIN CREDENTIALS');
    console.log('=================================');
    console.log('Email:    official.evolutiongadget@gmail.com');
    console.log('Password: adminev34578@');
    console.log('Username: admin-evolution987');
    console.log('Role:     ADMIN');
    console.log('User ID:', verifyAdmin?._id);
    console.log('=================================\n');

    console.log('🌐 Login URL: http://localhost:3000/admin/login\n');

    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

updateAdminEmail();
