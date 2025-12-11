import mongoose from 'mongoose';
import { User } from '../models/User';
import { UserRole } from '../types';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const verifyAndCreateAdmin = async () => {
  try {
    // Connect to MongoDB with database name
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('Connecting to MongoDB...');
    console.log('Database URI:', mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
    
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB successfully!');
    console.log('Database:', mongoose.connection.db?.databaseName);

    // List all users first
    console.log('\n=================================');
    console.log('Checking existing users...');
    console.log('=================================');
    
    const allUsers = await User.find({}).select('+password');
    console.log(`Found ${allUsers.length} user(s) in database`);
    
    if (allUsers.length > 0) {
      allUsers.forEach((user, index) => {
        console.log(`\nUser ${index + 1}:`);
        console.log('  - Name:', user.name);
        console.log('  - Email:', user.email);
        console.log('  - Role:', user.role);
        console.log('  - Active:', user.isActive);
        console.log('  - Created:', user.createdAt);
      });
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: 'admin@evulation.com' },
        { role: UserRole.ADMIN }
      ]
    }).select('+password');
    
    if (existingAdmin) {
      console.log('\n=================================');
      console.log('⚠ Admin user already exists!');
      console.log('=================================');
      console.log('Email:', existingAdmin.email);
      console.log('Name:', existingAdmin.name);
      console.log('Role:', existingAdmin.role);
      console.log('Active:', existingAdmin.isActive);
      
      // Ask if want to update password
      console.log('\n🔄 Updating admin password...');
      existingAdmin.password = 'adminev34578@';
      existingAdmin.name = 'admin-evolution987';
      await existingAdmin.save();
      console.log('✓ Admin user updated successfully!');
    } else {
      // Create new admin user
      console.log('\n=================================');
      console.log('Creating new admin user...');
      console.log('=================================');
      
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

      const savedAdmin = await adminUser.save();
      console.log('✓ Admin user created successfully!');
      console.log('User ID:', savedAdmin._id);
    }

    // Verify the admin was created/updated
    console.log('\n=================================');
    console.log('Verifying admin user...');
    console.log('=================================');
    
    const verifyAdmin = await User.findOne({ email: 'admin@evulation.com' });
    if (verifyAdmin) {
      console.log('✓ Admin user verified in database!');
      console.log('Email:', verifyAdmin.email);
      console.log('Name:', verifyAdmin.name);
      console.log('Role:', verifyAdmin.role);
      console.log('Active:', verifyAdmin.isActive);
      console.log('User ID:', verifyAdmin._id);
    } else {
      console.log('❌ Admin user NOT found in database!');
    }

    console.log('\n=================================');
    console.log('✅ ADMIN LOGIN CREDENTIALS');
    console.log('=================================');
    console.log('Email:    admin@evulation.com');
    console.log('Password: adminev34578@');
    console.log('Username: admin-evolution987');
    console.log('Role:     ADMIN');
    console.log('=================================\n');

    console.log('🌐 Login URL: http://localhost:3000/admin/login\n');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error);
    console.error('\nError details:', error instanceof Error ? error.message : 'Unknown error');
    if (error instanceof Error && error.stack) {
      console.error('Stack trace:', error.stack);
    }
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run the script
verifyAndCreateAdmin();
