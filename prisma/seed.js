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
      description: 'Pro subscription plan',
    },
  });

  const premiumPlan = await prisma.plan.create({
    data: {
      name: 'Premium',
      price: 48.99,
      description: 'Premium subscription plan',
    },
  });
  
  const createCreatorWithSubscription = async (email, username, hashedPassword, planId) => {
    // Create the creator and the subscription in the same transaction
    const { creator, subscription } = await prisma.$transaction(async (prisma) => {
      const newSubscription = await prisma.subscription.create({
        data: {
          status: 'active',
          paymentMethod: 'stripe',
          planChosen: {
            connect: { id: planId },
          },
        },
      });

      const newCreator = await prisma.creator.create({
        data: {
          email,
          username,
          password: hashedPassword,
          subscriptionId: newSubscription.id,
        },
      });

      // Update the subscription to link the creatorId
      await prisma.subscription.update({
        where: { id: newSubscription.id },
        data: {
          creatorId: newCreator.id,  // Link the creator to the subscription
        },
      });

      return { creator: newCreator, subscription: newSubscription };
    });

    console.log(`Created creator ${creator.username} with subscription ${subscription.id}`);
  };

  // Create creators with their associated subscriptions
  await createCreatorWithSubscription('creator1@example.com', 'creator1', hashedPassword1, proPlan.id);
  await createCreatorWithSubscription('creator2@example.com', 'creator2', hashedPassword2, premiumPlan.id);
  await createCreatorWithSubscription('creator3@example.com', 'creator3', hashedPassword1, basicPlan.id);
  await createCreatorWithSubscription('creator4@example.com', 'creator4', hashedPassword2, premiumPlan.id);

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
        author: { connect: { id: (await prisma.creator.findFirst({ where: { username: 'creator1' } })).id } },
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
        author: { connect: { id: (await prisma.creator.findFirst({ where: { username: 'creator2' } })).id } },
      },
    });

    // Assign tags and create media
    await assignTagsToContent(content, tagsForCreator2);
    await createMedia(1, content.id);
  }

  // Creator 3: Creates 11 content items, each with 10 tags and 3 media
  const tagsForCreator3 = await createTags(10);
  for (let i = 1; i <= 11; i++) {
    const content = await prisma.content.create({
      data: {
        title: `Content Title ${i} by Creator 3`,
        content: `This is the body of content ${i} created by creator3.`,
        author: { connect: { id: (await prisma.creator.findFirst({ where: { username: 'creator3' } })).id } },
      },
    });

    // Assign tags and create media
    await assignTagsToContent(content, tagsForCreator3);
    await createMedia(3, content.id);
  }

  // Creator 4: Creates 44 content items, each with 1 tag and 15 media
  const tagsForCreator4 = await createTags(1);
  for (let i = 1; i <= 44; i++) {
    const content = await prisma.content.create({
      data: {
        title: `Content Title ${i} by Creator 4`,
        content: `This is the body of content ${i} created by creator4.`,
        author: { connect: { id: (await prisma.creator.findFirst({ where: { username: 'creator4' } })).id } },
      },
    });

    // Assign tags and create media
    await assignTagsToContent(content, tagsForCreator4);
    await createMedia(15, content.id);
  }

  console.log(`4 test creators and their content created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });