// scripts/createAdmin.ts
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import prisma from '../src/shared/prisma';

async function main() {
  const phone = process.env.ADMIN_PHONE || '01710000000';
  const rawPassword = process.env.ADMIN_PASS || 'Admin@123';
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

  // Hash password
  const hashed = await bcrypt.hash(rawPassword, saltRounds);

  try {
    const user = await prisma.user.create({
      data: {
        firstName: 'Admin',
        lastName: 'User',
        nationalId: process.env.ADMIN_NID || '0000000000', // must be unique
        phoneNumber: phone, // must be unique
        password: hashed,
        pin: process.env.ADMIN_PIN || '1234',
        role: 'admin',
        isEmployee: true,
      },
    });

    console.log('✅ Admin created:');
    console.log({
      id: user.id,
      phoneNumber: user.phoneNumber,
      nationalId: user.nationalId,
      password: rawPassword,
    });
  } catch (err: any) {
    console.error('❌ Error creating admin:', err.message || err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
