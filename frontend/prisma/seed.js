const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const axios = require("axios");

async function HN() {
  const topicsUrl = 'https://your-api-endpoint/topics'; // Replace with your actual API endpoint for topics
  const commentsUrl = topicId => `https://your-api-endpoint/topics/${topicId}/comments`; // Replace with your actual API endpoint for comments

  try {
    // Fetch all topics
    const topicsResponse = await axios.get(topicsUrl);
    const topics = topicsResponse.data;

    if (topics.length === 0) {
      console.log('No topics found.');
      return;
    }

    // Select a random topic
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    // Fetch comments for the selected topic
    const commentsResponse = await axios.get(commentsUrl(randomTopic.id));
    const comments = commentsResponse.data;

    if (comments.length === 0) {
      console.log(`No comments found for topic: ${randomTopic.title}`);
      return;
    }

    // Select a random comment
    const randomComment = comments[Math.floor(Math.random() * comments.length)];

    console.log(`Topic: ${randomTopic.title}`);
    console.log(`Comment: ${randomComment.text}`);
    return randomComment;
  } catch (error) {
    console.error('Error fetching random comment:', error);
  }
}

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
      name: 'Subforum gfdsg',
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
      "SpiderMan",
      "Fantastic Doll",
      "Doctor Who is Shaw",
      "novella",
      "violin",
      "grandma pie made from green apple",
      "viola potter",
      "crismon sage",
      "best fighter in mma",
      "shit",
      "pretentious shit",
      "lovely pie of green",
      "yuni space flighter",
      "sfw anti-nsfw",
      "girls are more rational",
      "boys are more logical"
    ];
    const tags = [];
    for (const tagname of topicTags) {
      const prob = Math.random();
      if (prob <= 0.1) {
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
    const tagsForTopic = await createCustomTags();
    const topic = await prisma.topic.create({
      data: {
        title: `Topic ${i} in Subforum One`,
        description: `Description for Topic ${i} in Subforum One`,
        subforumId: subforum1.id, // Connect to Subforum One
      },
    });
    await assignTagsToTopic(topic, tagsForTopic);
    topicsSubforum1.push(topic);
  }

  const topicsSubforum2 = [];
  for (let i = 1; i <= 4; i++) {
    const tagsForTopic = await createCustomTags();
    const topic = await prisma.topic.create({
      data: {
        title: `Topic ${i} in Subforum Two`,
        description: `Description for Topic ${i} in Subforum Two`,
        subforumId: subforum2.id, // Connect to Subforum Two
      },
    });
    await assignTagsToTopic(topic, tagsForTopic);
    topicsSubforum2.push(topic);
  }

  const topicsSubforum3 = [];
  for (let i = 1; i <= 111; i++) {
    const tagsForTopic = await createCustomTags();
    const topic = await prisma.topic.create({
      data: {
        title: `Topic ${i} in Subforum Three`,
        description: `Description for Topic ${i} in Subforum Three`,
        subforumId: subforum3.id, // Connect to Subforum Three
      },
    });
    await assignTagsToTopic(topic, tagsForTopic);
    topicsSubforum3.push(topic);
  }

  console.log(`Created topics for Subforum One, Two, and Three`);

  // Create Comments
  for (const topic of topicsSubforum1) {
    await prisma.comment.create({
      data: {
        text: `Comment for ${topic.title}`,
        topicId: topic.id,
        forReplyId: `${topic.title} ${topic.id}`
      },
    });
  }

  for (const topic of topicsSubforum2) {
    const forr = `${topic.title} ${topic.id}`;
    await prisma.comment.create({
      data: {
        text: `Comment for ${topic.title}`,
        topicId: topic.id,
        forReplyId: forr
      },
    });
    const proo = Math.random();
    if (proo >= 0.3 && proo <= 0.4) {
      const forrk = `${topic.title} HN ${Math.random()}`;
      await prisma.comment.create({
        data: {
          text: HN(),
          topicId:topic.id,
          forReplyId: forrk,
          replyToId: forr
        }
      })
      const koko = Math.random();
      if (koko > 0.599999999999) {
        const fooorr = `dollar sign ${topic.description} HN ${Math.random()}`;
        await prisma.comment.create({
          data: {
            text: HN()+"/"+`${topic.description}`,
            topicId:topic.id,
            forReplyId:fooorr,
            replyToId:forrk
          }
        })
      }
    }
  }

  for (const topic of topicsSubforum3) {
    const firstfor = `${topic.title} ${topic.id}`;
    await prisma.comment.create({
      data: {
        text: `Comment for ${topic.title}`,
        topicId: topic.id,
        forReplyId: firstfor
      },
    });
    const firstPro = Math.random();
    if (firstPro < 0.15) {
      const secondFor = `${Math.random()} +HN ${Math.random()}`;
      await prisma.comment.create({
        data: {
          text:HN(),
          topicId:topic.id,
          forReplyId:secondFor,
          replyToId:firstfor
        }
      })
      const secondPro = Math.random();
      if (secondPro > 0.88 && secondPro < 0.99) {
        const thirdT = `${Math.random()} ${topic.description} HN ${Math.random()}`;
        await prisma.comment.create({
          data: {
            text: "奇淫怪巧 "+HN()+" 外強中乾",
            topicId: topic.id,
            forReplyId:thirdT,
            replyToId:secondFor
          }
        })
        const ffT = `${Math.random()} / HN ${Math.random()+2}`;
        await prisma.comment.create({
          data: {
            text: "司馬光 "+HN()+" 砸GANG 如別墅",
            topicId: topic.id,
            forReplyId:ffT,
            replyToId:secondFor
          }
        })
        const fiT = `${topic.description} HN ${Math.random()+Math.random()}`;
        await prisma.comment.create({
          data: {
            text: HN()+"Giant Luffery",
            topicId: topic.id,
            forReplyId:fiT,
            replyToId:secondFor
          }
        })
      }
    }
  }

  function getRanIntFromMinMax(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }  

  for (let g = 0;g<getRanIntFromMinMax(100,112);g++) {
    const randomTopicIndex = Math.floor(Math.random() * topicsSubforum1.length);
    const randomTopic = topicsSubforum1[randomTopicIndex];

    for (let i = 1; i <= getRanIntFromMinMax(3,15); i++) {
      const ranFirstFor = `${randomTopic.id} ${i}`
      await prisma.comment.create({
        data: {
          text: `Additional Comment ${i} for ${randomTopic.title}`,
          topicId: randomTopic.id,
          forReplyId: ranFirstFor
        },
      });
      const mamath = getRanIntFromMinMax(1,3)+Math.random();
      if (mamath<=1.8) {
        const ranSecFor = `${Math.random>(getRanIntFromMinMax(1,2)-Math.random)} math is hard as fun ${getRanIntFromMinMax(1,1000)}`;
        await prisma.comment.create({
          data: {
            text:HN()+"open fire rollar cooastter",
            topicId:randomTopic.id,
            forReplyId: ranSecFor,
            replyToId:ranFirstFor
          }
        })
        const laslasl = getRanIntFromMinMax(
          getRanIntFromMinMax(1,51),
          getRanIntFromMinMax(51,101)
        );
        const running = getRanIntFromMinMax(1,101);
        if (running < laslasl) {
          while (running!==laslasl) {
            await prisma.comment.create({
              data: {
                text: `${i} for ${randomTopic.description}`,
                topicId: randomTopic.id,
                forReplyId: `ranFirstFor${i}+_${Math.random}`
              },
            });
          }
        }

      }
    }
  }

  const randomTopicIndexqwe = Math.floor(Math.random() * topicsSubforum3.length);
  const randomTopicw = topicsSubforum3[randomTopicIndexqwe];

  for (let i = 1; i <= getRanIntFromMinMax(2,17); i++) {
    await prisma.comment.create({
      data: {
        text: `Add Comment ${i} for ${randomTopicw.title}`,
        topicId: randomTopicw.id,
        forReplyId: `${randomTopicw.id} ${i} ${getRanIntFromMinMax(1,3)-getRanIntFromMinMax(1,2)}`
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