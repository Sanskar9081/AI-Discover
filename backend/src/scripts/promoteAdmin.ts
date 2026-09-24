import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';

dotenv.config();

const promoteAdmin = async () => {
  try {
    const email = process.argv[2];
    
    if (!email) {
      console.error('Please provide an email address: npx tsx src/scripts/promoteAdmin.ts <email>');
      process.exit(1);
    }

    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is missing from .env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`User with email ${email} not found.`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`Successfully promoted ${email} to admin.`);
    process.exit(0);
  } catch (error) {
    console.error('Error promoting admin:', error);
    process.exit(1);
  }
};

promoteAdmin();
