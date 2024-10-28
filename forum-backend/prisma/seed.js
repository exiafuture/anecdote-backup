const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
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

  console.log(`Created subforums: ${subforum1.name}, ${subforum2.name}, ${subforum3.name}`);

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
      },
    });
  }

  // One comment for each topic in Subforum Two
  for (const topic of topicsSubforum2) {
    await prisma.comment.create({
      data: {
        text: `Comment for ${topic.title}`,
        topicId: topic.id,
      },
    });
  }

  for (const topic of topicsSubforum3) {
    await prisma.comment.create({
      data: {
        text: `Comment for ${topic.title}`,
        topicId: topic.id,
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