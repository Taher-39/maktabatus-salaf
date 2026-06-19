import { User } from '../modules/auth/auth.model';
import { connectDB } from './db';
import { env } from './env';

const seed = async () => {
  try {
    console.log('🌱 Starting seed...');
    // show a masked MongoDB URI to help debug connection differences
    const uri = env.MONGODB_URI || process.env.MONGODB_URI || '';
    const masked = uri.replace(/(mongodb(?:\+srv)?:\/\/)([^:@\/]+)(:[^@\/]+)?@/, '$1***:***@');
    console.log('Using MongoDB URI:', masked.substring(0, 80));
    await connectDB();
    console.log('✅ Database connected');

    const existing = await User.findOne({ phone: '01700000000' });
    if (existing) {
      console.log('Admin already exists');
      process.exit(0);
    }

    await User.create({
      name: 'Admin',
      phone: '01700000000',
      password: '123456', // pre-save hook নিজেই hash করবে
      role: 'admin',
    });

    console.log('✅ Admin created!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();