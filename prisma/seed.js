const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  // Hash the passwords
  const hashedPassword1 = await bcrypt.hash('password123', 10);
  const hashedPassword2 = await bcrypt.hash('password456', 10);

  const basicPlan = await prisma.plan.create({
    data: {
      name: 'Basic',
      price: 27.99,
      description: 'Basic subscription plan',
    },
  });

  const proPlan = await prisma.plan.create({
    data: {
      name: 'Pro',
      price: 33.99,
      description: 'Premium subscription plan',
    },
  });

  const premiumPlan = await prisma.plan.create({
    data: {
      name: 'Premium',
      price: 48.99,
      description: 'Premium subscription plan',
    },
  });

  // Create two subscriptions, one for each creator
  const subscriptionForCreator1 = await prisma.subscription.create({
    data: {
      status: 'active',
      paymentMethod: 'stripe',
      planChosen: {
        connect: { id: proPlan.id },
      },
    },
  });

  const subscriptionForCreator2 = await prisma.subscription.create({
    data: {
      status: 'active',
      paymentMethod: 'stripe',
      planChosen: {
        connect: { id: premiumPlan.id },
      },
    },
  });

  // Create two subscriptions, one for each creator
  const subscriptionForCreator3 = await prisma.subscription.create({
    data: {
      status: 'active',
      paymentMethod: 'stripe',
      planChosen: {
        connect: { id: basicPlan.id },
      },
    },
  });

  const subscriptionForCreator4 = await prisma.subscription.create({
    data: {
      status: 'active',
      paymentMethod: 'stripe',
      planChosen: {
        connect: { id: premiumPlan.id },
      },
    },
  });

  // Create two creators and assign their subscription
  const creator1 = await prisma.creator.create({
    data: {
      email: 'creator1@example.com',
      username: 'creator1',
      password: hashedPassword1,
      subscriptionId: subscriptionForCreator1.id, // Link the subscription
    },
  });

  const creator2 = await prisma.creator.create({
    data: {
      email: 'creator2@example.com',
      username: 'creator2',
      password: hashedPassword2,
      subscriptionId: subscriptionForCreator2.id, // Link the subscription
    },
  });

  const creator3 = await prisma.creator.create({
    data: {
      email: 'creator3@example.com',
      username: 'creator3',
      password: hashedPassword1,
      subscriptionId: subscriptionForCreator3.id, // Link the subscription
    },
  });

  const creator4 = await prisma.creator.create({
    data: {
      email: 'creator4@example.com',
      username: 'creator4',
      password: hashedPassword2,
      subscriptionId: subscriptionForCreator4.id, // Link the subscription
    },
  });

  // Helper function to create tags
  const createTags = async (numTags) => {
    const tags = [];
    for (let i = 1; i <= numTags; i++) {
      const tag = await prisma.tag.upsert({
        where: { name: `Tag${i}` },
        update: {},
        create: { name: `Tag${i}` },
      });
      tags.push(tag);
    }
    return tags;
  };

  // Helper function to create media
  const createMedia = async (numMedia, contentId) => {
    const medias = [];
    for (let i = 1; i <= numMedia; i++) {
      const media = await prisma.media.create({
        data: {
          url: "https://wieck-mbusa-production.s3.amazonaws.com/photos/649b91bd0b9f17f65f17ff07630c6e4715681c4b/preview-928x522.jpg",
          content: { connect: { id: contentId } },
        },
      });
      medias.push(media);
    }
    return medias;
  };

  // Assigning tags to content
  const assignTagsToContent = async (content, tags) => {
    await prisma.content.update({
      where: { id: content.id },
      data: {
        tags: {
          connect: tags.map(tag => ({ id: tag.id })),
        },
      },
    });
  };

  // Creator 1: Creates 22 content items, each with 3 tags and 3 media
  const tagsForCreator1 = await createTags(3);
  for (let i = 1; i <= 22; i++) {
    const content = await prisma.content.create({
      data: {
        title: `Content Title ${i} by Creator 1`,
        content: `This is the body of content ${i} created by creator1.`,
        author: { connect: { id: creator1.id } },
      },
    });

    // Assign tags and create media
    await assignTagsToContent(content, tagsForCreator1);
    await createMedia(3, content.id);
  }

  // Creator 2: Creates 33 content items, each with 5 tags and 1 media
  const tagsForCreator2 = await createTags(5);
  for (let i = 1; i <= 33; i++) {
    const content = await prisma.content.create({
      data: {
        title: `Content Title ${i} by Creator 2`,
        content: `This is the body of content ${i} created by creator2.`,
        author: { connect: { id: creator2.id } },
      },
    });

    // Assign tags and create media
    await assignTagsToContent(content, tagsForCreator2);
    await createMedia(1, content.id);
  }

  const tagsForCreator3 = await createTags(10);
  for (let i = 1; i <= 11; i++) {
    const content = await prisma.content.create({
      data: {
        title: `Content Title ${i} by Creator 3`,
        content: `This is the body of content ${i} created by creator1.`,
        author: { connect: { id: creator1.id } },
      },
    });

    // Assign tags and create media
    await assignTagsToContent(content, tagsForCreator3);
    await createMedia(3, content.id);
  }

  const tagsForCreator4 = await createTags(1);
  for (let i = 1; i <= 44; i++) {
    const content = await prisma.content.create({
      data: {
        title: `Content Title ${i} by Creator 4`,
        content: `This is the body of content ${i} created by creator2.`,
        author: { connect: { id: creator2.id } },
      },
    });

    // Assign tags and create media
    await assignTagsToContent(content, tagsForCreator4);
    await createMedia(15, content.id);
  }

  console.log(`${creator1}\n${creator2}\n${creator3}\n${creator4}\n4 test data created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });