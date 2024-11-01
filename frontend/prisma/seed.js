const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  // Hash the passwords
  const hashedPassword1 = await bcrypt.hash('password123', 10);
  const hashedPassword2 = await bcrypt.hash('password456', 10);
  const hashedPasswordAdmin = await bcrypt.hash(
    "thisisaplatformforaspirationandcontinuationtoprosperity",10
  );

  await prisma.admin.create({
    data: {
      email:"admin@proton.murduck",
      username:"con4lighting",
      password: hashedPasswordAdmin,
    },
  });

  const basicPlan = await prisma.plan.create({
    data: {
      name: 'Basic',
      price: 27.99,
    },
  });

  const proPlan = await prisma.plan.create({
    data: {
      name: 'Pro',
      price: 33.99,
    },
  });

  const premiumPlan = await prisma.plan.create({
    data: {
      name: 'Premium',
      price: 48.99,
    },
  });
  
  const createCreatorWithSubscription = async (
    email, username, hashedPassword, planId) => {
    // Create the creator and the subscription in the same transaction
    const { creator, subscription } = await prisma.$transaction(
      async (prisma) => {
      const newCreator = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
        },
      });

      const now = new Date();
      const later = new Date(now);
      later.setMonth(now.getMonth()+1);
      const newSubscription = await prisma.subscription.create({
        data: {
          status: 'active',
          paymentMethod: 'stripe',
          planChosen: {
            connect: { id: planId },
          },
          startDateThisRound: now,
          endDateThisRound: later,
          userId: newCreator.id
        },
      });

      await prisma.user.update({
        where: {id:newCreator.id},
        data: {
          subscriptionId: newSubscription.id,
        }
      })
      return { creator: newCreator, subscription: newSubscription };
    });

    console.log(`Created user ${creator.username} with subscription ${subscription.id}`);
  };

  // Create creators with their associated subscriptions
  await createCreatorWithSubscription('test1@example.com', 'test1', hashedPassword1, proPlan.id);
  await createCreatorWithSubscription('test2@example.com', 'test2', hashedPassword2, premiumPlan.id);
  await createCreatorWithSubscription('test3@example.com', 'test3', hashedPassword1, basicPlan.id);
  await createCreatorWithSubscription('test4@example.com', 'test4', hashedPassword2, premiumPlan.id);

  // Helper function to create tags
  const createTags = async (numTags) => {
    const tags = [];
    for (let i = 1; i <= numTags; i++) {
      const tag = await prisma.label.upsert({
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
          type: "image"
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
        author: { connect: { id: (await prisma.user.findFirst({ where: { username: 'test1' } })).id } },
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
        author: { connect: { id: (await prisma.user.findFirst({ where: { username: 'test2' } })).id } },
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
        author: { connect: { id: (await prisma.user.findFirst({ where: { username: 'test3' } })).id } },
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
        author: { connect: { id: (await prisma.user.findFirst({ where: { username: 'test4' } })).id } },
      },
    });

    // Assign tags and create media
    await assignTagsToContent(content, tagsForCreator4);
    await createMedia(15, content.id);
  }

  console.log(`4 test creators and their content created`);

  const mainForum = await prisma.forum.create({
    data:{}
  });

  // Create Subforums
  const subforum1 = await prisma.subforum.create({
    data: {
      name: 'Subforum One',
      description: 'This is the first subforum',
      forumId: mainForum.id
    },
  });

  const subforum2 = await prisma.subforum.create({
    data: {
      name: 'Subforum Two',
      forumId: mainForum.id,
      description: 'This is the second subforum',
    },
  });

  const subforum3 = await prisma.subforum.create({
    data: {
      name: 'Subforum Three',
      forumId: mainForum.id,
      description: 'This is the third subforum',
    },
  });

  const subforum4 = await prisma.subforum.create({
    data: {
      name: 'Horseshit',
      forumId: mainForum.id,
      description: 'my fart is basic',
    },
  });

  const subforum5 = await prisma.subforum.create({
    data: {
      name: 'change me',
      forumId: mainForum.id,
      description: 'This is the subforum',
    },
  });

  const subforum6 = await prisma.subforum.create({
    data: {
      name: 'the east is stubborn but west haha room for whataever change',
      forumId: mainForum.id,
      description: 'This subforum',
    },
  });

  const subforum7 = await prisma.subforum.create({
    data: {
      name: 'crypto is nothing but shit loader',
      forumId: mainForum.id,
      description: 'This is it',
    },
  });

  const subforum8 = await prisma.subforum.create({
    data: {
      name: 'bdjfffg',
      forumId: mainForum.id,
      description: 'cambridge is chess master that oxford beats in go',
    },
  });

  const subforum9 = await prisma.subforum.create({
    data: {
      name: 'Subforum Three',
      forumId: mainForum.id,
      description: 'television vicious bish',
    },
  });

  const subforum10 = await prisma.subforum.create({
    data: {
      name: 'too much do',
      forumId: mainForum.id,
      description: 'music moves too fast',
    },
  });

  console.log(
    `Created subforums: ${subforum1.name}, ${subforum2.name}, ${subforum3.name}
    , ${subforum4.name}, ${subforum5.name}, ${subforum6.name}, ${subforum7.name}
    , ${subforum8.name}, ${subforum9.name}, ${subforum10.name}
    `
  );

  // Assigning tags to topic
  const assignTagsToTopic = async (topic, tags) => {
    await prisma.topic.update({
      where: { id: topic.id },
      data: {
        labels: {
          connect: tags.map(tag => ({ id: tag.id })),
        },
      },
    });
  };

  const createCustomTags = async () => {
    const topicTags= [
      "Amazing SpiderMan",
      "Fantastic Babe",
      "Doctor Who is Shaw",
      "novella",
      "violin",
      "viola potter",
      "crismon sage",
      "best fighter in mma"
    ];
    const tags = [];
    for (const tagname of topicTags) {
      const prob = Math.random();
      if (prob > 0.3) {
        const tag = await prisma.label.upsert({
          where: { name: tagname },
          update: {},
          create: { name: tagname },
        });
        tags.push(tag);
      }
    }
    return tags;
  };

  // Create Topics
  const topicsSubforum1 = [];
  for (let i = 1; i <= 3; i++) {
    const topic = await prisma.topic.create({
      data: {
        title: `Topic ${i} in Subforum One`,
        description: `Description for Topic ${i} in Subforum One`,
        subforumId: subforum1.id, // Connect to Subforum One
      },
    });
    topicsSubforum1.push(topic);
  }

  const topicsSubforum2 = [];
  for (let i = 1; i <= 4; i++) {
    const topic = await prisma.topic.create({
      data: {
        title: `Topic ${i} in Subforum Two`,
        description: `Description for Topic ${i} in Subforum Two`,
        subforumId: subforum2.id, // Connect to Subforum Two
      },
    });
    topicsSubforum2.push(topic);
  }

  const topicsSubforum3 = [];
  for (let i = 1; i <= 111; i++) {
    const topic = await prisma.topic.create({
      data: {
        title: `Topic ${i} in Subforum Three`,
        description: `Description for Topic ${i} in Subforum Three`,
        subforumId: subforum3.id, // Connect to Subforum Three
      },
    });
    topicsSubforum3.push(topic);
  }

  console.log(`Created topics for Subforum One, Two, and Three`);

  // Create Comments
  // One comment for each topic in Subforum One
  for (const topic of topicsSubforum1) {
    await prisma.comment.create({
      data: {
        text: `Comment for ${topic.title}`,
        topicId: topic.id,
        forReplyId: `${topic.title} ${topic.id}`
      },
    });
  }

  // One comment for each topic in Subforum Two
  for (const topic of topicsSubforum2) {
    await prisma.comment.create({
      data: {
        text: `Comment for ${topic.title}`,
        topicId: topic.id,
        forReplyId: `${topic.title} ${topic.id}`
      },
    });
  }

  for (const topic of topicsSubforum3) {
    await prisma.comment.create({
      data: {
        text: `Comment for ${topic.title}`,
        topicId: topic.id,
        forReplyId: `${topic.title} ${topic.id}`
      },
    });
  }

  // One comment for each topic in Subforum Three
  const randomTopicIndex = Math.floor(Math.random() * topicsSubforum3.length);
  const randomTopic = topicsSubforum3[randomTopicIndex];

  // Create 10 additional comments for a randomly selected topic in Subforum Three
  for (let i = 1; i <= 10; i++) {
    await prisma.comment.create({
      data: {
        text: `Additional Comment ${i} for ${randomTopic.title}`,
        topicId: randomTopic.id,
        forReplyId: `${randomTopic.id} ${i}`
      },
    });
  }

  console.log(`Created comments for topics in all subforums`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });