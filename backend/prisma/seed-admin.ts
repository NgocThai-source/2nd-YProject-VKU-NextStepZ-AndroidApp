import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedAdmin() {
    console.log('🔐 Seeding admin account...');

    const adminEmail = 'admin@nextstepz.vn';
    const adminPassword = '123';

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (existingAdmin) {
        console.log('✅ Admin account already exists:', adminEmail);
        return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user with only the required fields
    const admin = await prisma.user.create({
        data: {
            email: adminEmail,
            username: 'admin',
            phone: '0000000000', // Required field
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'NextStepZ',
            role: 'admin',
            isActive: true,
        },
    });

    // Update isVerified separately if the field exists
    try {
        await prisma.$executeRaw`UPDATE users SET "isVerified" = true WHERE id = ${admin.id}`;
        console.log('✅ Admin verified status set');
    } catch (e) {
        console.log('Note: Could not set isVerified (field may not exist yet)');
    }

    console.log('✅ Admin account created successfully!');
    console.log('   Email:', admin.email);
    console.log('   Username:', admin.username);
    console.log('   Role:', admin.role);
    console.log('');
    console.log('⚠️  IMPORTANT: Change the default password after first login!');
    console.log('   Default password: Admin@123');
}

seedAdmin()
    .then(() => {
        console.log('✅ Seed completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
