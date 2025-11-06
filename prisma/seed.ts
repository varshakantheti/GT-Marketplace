import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo users
  const user1 = await prisma.user.upsert({
    where: { email: 'seller@example.com' },
    update: {},
    create: {
      email: 'seller@example.com',
      name: 'John Doe',
      major: 'Computer Science',
      gradYear: 2025,
      emailVerified: new Date(),
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'buyer@example.com' },
    update: {},
    create: {
      email: 'buyer@example.com',
      name: 'Jane Smith',
      major: 'Business',
      gradYear: 2026,
      emailVerified: new Date(),
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  // Create sample listings
  const categories = ['Electronics', 'Furniture', 'Books', 'Clothing', 'Other'];
  const conditions = ['NEW', 'LIKE_NEW', 'EXCELLENT', 'GOOD', 'FAIR'] as const;
  const locations = ['ON_CAMPUS', 'OFF_CAMPUS'] as const;

  const sampleListings = [
    {
      title: 'MacBook Pro 14" - Excellent Condition',
      description: '2023 MacBook Pro 14" with M2 Pro chip. Used for one semester, excellent condition. Includes charger and original box.',
      price: 1800,
      category: categories[0],
      condition: conditions[2],
      location: locations[0],
      images: [],
      sellerId: user1.id,
    },
    {
      title: 'IKEA Desk - Like New',
      description: 'White IKEA desk, perfect for dorm room. Barely used, moving out.',
      price: 75,
      category: categories[1],
      condition: conditions[1],
      location: locations[0],
      images: [],
      sellerId: user1.id,
    },
    {
      title: 'Calculus Textbook - 3rd Edition',
      description: 'Stewart Calculus 3rd edition. Good condition, some highlighting.',
      price: 45,
      category: categories[2],
      condition: conditions[3],
      location: locations[0],
      images: [],
      sellerId: user1.id,
    },
    {
      title: 'GT Hoodie - Size M',
      description: 'Official Georgia Tech hoodie, worn a few times. Great condition.',
      price: 35,
      category: categories[3],
      condition: conditions[2],
      location: locations[0],
      images: [],
      sellerId: user2.id,
    },
    {
      title: 'Bike Lock - Heavy Duty',
      description: 'Kryptonite bike lock, never used. Moving and no longer need it.',
      price: 25,
      category: categories[4],
      condition: conditions[0],
      location: locations[0],
      images: [],
      sellerId: user2.id,
    },
  ];

  for (const listing of sampleListings) {
    await prisma.listing.create({
      data: listing,
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

