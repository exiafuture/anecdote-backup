const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  const hashedPasswordA = await bcrypt.hash('password123', 10);
  const hashedPasswordB = await bcrypt.hash('password456', 10);

  // Create User A
  const userA = await prisma.user.create({
    data: {
      email: 'userA@A.com',
      username: 'userAex',
      password: hashedPasswordA,
    },
  });

  // Create User A
  const userB = await prisma.user.create({
    data: {
      email: 'userB@b.com',
      username: 'userBex',
      password: hashedPasswordB,
    },
  });

  // Create posts for User A
  for (let i = 1; i <= 11; i++) {
    await prisma.post.create({
      data: {
        title: `Post A ${i}`,
        content: `This is the content for post A ${i}.`,
        authorId: userA.id,
        images: {
          create: {
            url: "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/60e08cf8-f98b-5fec-a927-9bcd88eeda42/e170a593-958f-5eb5-b86b-d1103edb686e.jpg",
          },
        },
        videos: {
          create: {
            url: "https://www.youtube.com/watch?v=Qrym1Lk3c1Q",
            duration: 60, // Example duration
          },
        },
        tags: {
          create: [
            { name: "Apple" },
            { name: `test ${i + 1}` },
            { name: "gadget" },
          ],
        },
      },
    });
  }

  // Create posts for User B
  for (let i = 1; i <= 8; i++) {
    await prisma.post.create({
      data: {
        title: `Post B ${i}`,
        content: `This is the content for post B ${i}.`,
        authorId: userB.id,
        images: {
          create: {
            url: "https://wieck-mbusa-production.s3.amazonaws.com/photos/649b91bd0b9f17f65f17ff07630c6e4715681c4b/preview-928x522.jpg",
          },
        },
        videos: {
          create: {
            url: "https://www.youtube.com/watch?v=Qrym1Lk3c1Q",
            duration: 60, // Example duration
          },
        },
        tags: {
          create: [
            { name: "test" },
            { name: `test ${i + 1}` },
            { name: "Olympic" },
            { name: "Sprinting" },
            { name: "Germany" },
          ],
        },
      },
    });
  }

  console.log('Seeded Users with posts, images, and tags.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
