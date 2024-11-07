const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const axios = require("axios");

async function newContentIdea() {
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
}

async function newUserRegister() {
  // Hash the passwords
  const hashedPassword1 = await bcrypt.hash('password123', 10);
  const hashedPassword2 = await bcrypt.hash('password456', 10);
  const hashedPasswordAdmin = await bcrypt.hash(
    "thisisitisthat",10
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
}

async function newSub() {
  function getRanIntFromMinMax(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }  
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
      "咖哩波特",
      "novella",
      "violin",
      "grandma pie made from green apple",
      "viola potter",
      "crismon sage",
      "best fighter in mma",
      "til",
      "lovely pie of green",
      "sfw anti-nsfw",
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
  for (let i = 1; i <= 81; i++) {
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

  console.log(`Created topics for Subforums`);
  
  var chinese="不會接受對方不是大家回覆不是的話就法院的文件你的手機費得到喔法國i違法你房間看到色人呢度色人手機電話費"
  var chinees ="脂肪含量超標的公司是不是不是你係唔好睇佢你的咁晏你的電話因為我你哋可以我哋兩樣東西方8節日你哋可以因為";
  var enen = "WhenthecastfoundoutaboutSnapetrueloyaltiesaftertheDeathlyHallows";
  var iiiiiiid=[
    subforum1.id,
    subforum2.id,
    subforum3.id,
    subforum4.id,
    subforum5.id,
    subforum6.id,
    subforum7.id,
    subforum8.id,
    subforum9.id,
    subforum10.id
  ]
  var tttt=[];
  for (i=0;i<7;i++){
    var frfrfr=[];
    for (let u = 1; u <= getRanIntFromMinMax(2,17); u++) {
      const tagsForTopic = await createCustomTags();

      var jobs=`${enen[getRanIntFromMinMax(0,enen.length)]}${chinees[getRanIntFromMinMax(0,chinees.length)]}${chinese[getRanIntFromMinMax(0,chinese.length)]}${enen[getRanIntFromMinMax(0,enen.length)]}${chinees[getRanIntFromMinMax(0,chinees.length)]}${chinese[getRanIntFromMinMax(0,chinese.length)]}${enen[getRanIntFromMinMax(0,enen.length)]}`;

      const topic = await prisma.topic.create({
        data: {
          title: jobs,
          description: `Description ${u} in Subforum ${i+4}`,
          subforumId: iiiiiiid[i+3], // Connect
        },
      });
      await assignTagsToTopic(topic, tagsForTopic);
      frfrfr.push(topic);
    }
    tttt.push(frfrfr);
  }     
  var topicsSubforum4 = tttt[0];
  var topicsSubforum5 = tttt[1];
  var topicsSubforum6 = tttt[2];
  var topicsSubforum7 = tttt[3];
  var topicsSubforum8 = tttt[4];
  var topicsSubforum9 = tttt[5];
  var topicsSubforum10 = tttt[6];
  return {
    topicsSubforum1,
    topicsSubforum2,
    topicsSubforum3,
    topicsSubforum4,
    topicsSubforum5,
    topicsSubforum6,
    topicsSubforum7,
    topicsSubforum8,
    topicsSubforum9,
    topicsSubforum10
  };
}

async function newHN() {
  var allSS = [];
  async function HackerN() {
    const topStoriesUrl = 'https://hacker-news.firebaseio.com/v0/topstories.json';
    const itemUrl = id => `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
  
    const topStoriesResponse = await axios.get(topStoriesUrl);
    const topStories = topStoriesResponse.data;

    // Select a random story
    var randomStoryId = topStories[Math.floor(Math.random() * topStories.length)];
    var storyResponse = await axios.get(itemUrl(randomStoryId));
    var story = storyResponse.data;
    console.log(`Story: ${story.title}`);
    
    return story.title.toString();
  }
  while (allSS.length != 67) {
    var instnace = await HackerN();
    allSS.push(instnace);
  }
  return allSS;
}

async function main() {
  function getRanIntFromMinMax(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }  
  await newUserRegister();
  await newContentIdea();
  var {
    topicsSubforum1,topicsSubforum2,topicsSubforum3,
    topicsSubforum4,topicsSubforum5,topicsSubforum6,
    topicsSubforum7,topicsSubforum8,topicsSubforum9,
    topicsSubforum10
  }=await newSub();
  var allS = await newHN();
  var lllee = allS.length;
  // Create Comments
  var kwe =0;

  var overall="TheoutcomeisthatMollydoesnotjustdefendherdaughterbutsheensuresBellatrixwillneverharmanyoneagain";
  overall+="彈性化23938484747考媽咪話佢哋唔好213猪我哋買到野餐5579999皆我都係咁樣嘅時候你自己睇到嘅時候就算32";
  overall+="把環境打掃荒誕不經啊說不定就啊說不定就阿克蘇的巴斯克大聲的巴哈介紹的凱森啊可是覺得你看完但看似簡單";

  var rererearr = [
    topicsSubforum5,topicsSubforum6,
    topicsSubforum7,topicsSubforum8,topicsSubforum9,
    topicsSubforum10
  ];

  for (y=0;y<6;y++) {
    var specialTop = [];
    var specialTopId = [];
    while (specialTop.length!=rererearr[y].length*5) {
      var generated = "";
      while (generated.length!=10) {
        generated+=overall[getRanIntFromMinMax(0,overall.length)]
      }
      if (!specialTop.includes(generated)) {
        specialTop.push(generated);
      }
    }
    while (specialTopId.length!=rererearr[y].length*5) {
      var generated = "";
      while (generated.length!=24) {
        generated+=overall[getRanIntFromMinMax(0,overall.length)]
      }
      if (!specialTopId.includes(generated)) {
        specialTopId.push(generated);
      }
    }
    for (const topic of rererearr[y]) {
      var s = rererearr[y].indexOf(topic)*5;
      await prisma.comment.create({
        data: {
          text: specialTop[s],
          topicId: topic.id,
          forReplyId: specialTopId[s]
        },
      });
      kwe+=1;
      var isthere=false;
      if (Math.random()<0.3) {
        await prisma.comment.create({
          data: {
            text: specialTop[s+1],
            topicId: topic.id,
            forReplyId: specialTopId[s+1],
            replyToId:specialTopId[s]
          },
        });
        isthere=true;
        kwe+=1;
      } else {
        await prisma.comment.create({
          data: {
            text: specialTop[s+1],
            topicId: topic.id,
            forReplyId: specialTopId[s+1]
          },
        });
        kwe+=1;
        isthere=false;
      }
      await prisma.comment.create({
        data: {
          text: specialTop[s+2],
          topicId: topic.id,
          forReplyId: specialTopId[s+2],
          replyToId: Math.random()<0.7 ? specialTopId[s+1] : null 
        },
      });
      kwe+=1;
      const thirddd = Math.random();
      await prisma.comment.create({
        data: {
          text: specialTop[s+3],
          topicId: topic.id,
          forReplyId: specialTopId[s+3],
          replyToId: thirddd < 0.41 ? 
          specialTopId[s+1] : 
          thirddd >=0.41 && thirddd < 0.64 ? 
          specialTopId[s+2]:null 
        },
      });
      isthere = thirddd >=0.64 ? false : true;
      kwe+=1;
      if (Math.random() > 0.88) {
        await prisma.comment.create({
          data: {
            text: specialTop[s+4],
            topicId: topic.id,
            forReplyId: specialTopId[s+4],
            replyToId: specialTopId[s+2] 
          },
        });
        kwe+=1;
      } else {
        const jcndffs = Math.random()
        await prisma.comment.create({
          data: {
            text: specialTop[s+4],
            topicId: topic.id,
            forReplyId: specialTopId[s+4],
            replyToId: jcndffs < 0.41 ? 
            specialTopId[s+1] : 
            jcndffs >=0.41 && jcndffs < 0.64 ? 
            specialTopId[s+3]:specialTopId[s] 
          },
        });
        kwe+=1;
      }
      if (isthere===true) {
        console.log(topic.id)
      }
    }
  }

  for (const topic of topicsSubforum4) {
    var sub4tophigh = ""
    var sub4tophightop = ""
    for (p=0;p<13;p++){
      var tqwww="";
      while (true){
        var jshsh = overall[getRanIntFromMinMax(0,overall.length)];
        if (jshsh!==" "){
          tqwww=jshsh;
          break
        }
      }
      sub4tophigh+=tqwww
      sub4tophightop+=overall[getRanIntFromMinMax(0,overall.length)];
      sub4tophightop+=`${Math.random()}`
    }
    await prisma.comment.create({
      data: {
        text: sub4tophightop,
        topicId: topic.id,
        forReplyId: sub4tophigh
      },
    });
    kwe+=1;
    var tratt12r = Math.random();
    var all4iid = [];
    var sub4tophighnext=""
    var sub4tophightopnext = ""
    for (p=0;p<13;p++){
      var tqwww="";
      while (true){
        var jshsh = overall[getRanIntFromMinMax(0,overall.length)];
        if (jshsh!==" "){
          tqwww=jshsh;
          break
        }
      }
      sub4tophighnext+=tqwww
      sub4tophightopnext+=overall[getRanIntFromMinMax(0,overall.length)];
      sub4tophightopnext+=`${Math.random()}`
    }
    all4iid.push(sub4tophighnext);
    if (tratt12r<0.4) {
      await prisma.comment.create({
        data: {
          text: sub4tophightopnext,
          topicId: topic.id,
          forReplyId: sub4tophighnext,
        },
      });
      kwe+=1;
    } else {
      await prisma.comment.create({
        data: {
          text: sub4tophightopnext,
          topicId: topic.id,
          forReplyId: sub4tophighnext,
          replyToId:sub4tophigh
        },
      });
      kwe+=1;
    }
    var sub4tophighnextt=""
    var sub4tophightopnextt = ""
    for (p=0;p<11;p++){
      var tqwww="";
      while (true){
        var jshsh = overall[getRanIntFromMinMax(0,overall.length)];
        if (jshsh!==" ") {
          tqwww=jshsh;
          break;
        }
      }
      sub4tophighnextt+=tqwww
      sub4tophightopnextt+=overall[getRanIntFromMinMax(0,overall.length)];
      sub4tophightopnextt+=`${Math.random()}`
    }
    if (Math.random()<0.15) {
      await prisma.comment.create({
        data: {
          text: sub4tophightopnextt,
          topicId: topic.id,
          forReplyId: sub4tophighnextt,
        },
      });
      all4iid.push(sub4tophighnextt);
      kwe+=1;
    } else {
      await prisma.comment.create({
        data: {
          text: sub4tophightopnextt,
          topicId: topic.id,
          forReplyId: sub4tophighnextt,
          replyToId:Math.random() > 0.25 ? sub4tophigh:all4iid[getRanIntFromMinMax(0,all4iid.length)] 
        },
      });
      kwe+=1;
    }
  }

  for (const topic of topicsSubforum1) {
    // test nested tree comments for ui
    const sub1forthistop = `${topic.title} ${topic.id}`;
    await prisma.comment.create({
      data: {
        text: `Comment for ${topic.title}`,
        topicId: topic.id,
        forReplyId: sub1forthistop
      },
    });
    kwe+=1;
    const stt = "azbycxdefuvwghijqrstjklmnop";
    const tts = "ABCDEFGHJIKLMNZYXWVUTSROPQ";
    const mandari = "這是個好東西 真不賴！來來來，一起吃。"
    var sub1forloop = 0;
    var tgh = 0;
    var arrOfFors= [];
    while (tgh<6) {
      var iid=`${stt[getRanIntFromMinMax(0,stt.length)]}${
        Math.random()+getRanIntFromMinMax(0,2)*Math.random()+getRanIntFromMinMax(1,4)
      }${stt[getRanIntFromMinMax(0,stt.length)]}${tts[getRanIntFromMinMax(0,15)]}${mandari[getRanIntFromMinMax(0,mandari.length)]}`;
      await prisma.comment.create({
        data: {
          text: `${allS[getRanIntFromMinMax(0,lllee)]}`+"_"+"man"+`${Math.random()}`,
          topicId: topic.id,
          forReplyId: iid,
        },
      });
      kwe+=1;
      arrOfFors.push(iid);
      tgh+=1;
    }
    while (sub1forloop<14) {
      var eitherColumnOrTree = Math.random();
      var iid=`${tts[getRanIntFromMinMax(5,16)]}${
        Math.round(Math.random()+getRanIntFromMinMax(0,2)*Math.random()+getRanIntFromMinMax(1,4))
      -0.999999}_${mandari[getRanIntFromMinMax(0,mandari.length)]}${stt[getRanIntFromMinMax(0,stt.length)]}`;
      var seconmdArr = [];
      if (eitherColumnOrTree<=0.5) {
        await prisma.comment.create({
          data: {
            text: `${allS[getRanIntFromMinMax(0,lllee)]}`+"_"+"man"+`${Math.random()}`,
            topicId: topic.id,
            forReplyId: iid,
            replyToId:sub1forthistop
          },
        });
        seconmdArr.push(iid);
        kwe+=1;
      } else if (eitherColumnOrTree>0.5&&eitherColumnOrTree<=0.7) {
        var recurfor = arrOfFors[getRanIntFromMinMax(0,arrOfFors.length)];
        await prisma.comment.create({
          data: {
            text: `${allS[getRanIntFromMinMax(0,lllee)]}`+"_"+"consant"+`${Math.random()}`,
            topicId: topic.id,
            forReplyId: iid,
            replyToId:recurfor
          },
        });
        seconmdArr.push(iid);
        kwe+=1;
      } else {
        var recurfor = seconmdArr[getRanIntFromMinMax(0,seconmdArr.length)];
        await prisma.comment.create({
          data: {
            text: `${mandari[0]}`+`${allS[getRanIntFromMinMax(0,lllee)]}`+`${Math.random()}`+"consant"+`${tts[getRanIntFromMinMax(1,14)]}`,
            topicId: topic.id,
            forReplyId: iid,
            replyToId:recurfor
          },
        });
        seconmdArr.push(iid);
        kwe+=1;
      }
      sub1forloop+=1;
    }
  }

  console.log("all done for sub 1");

  for (const topic of topicsSubforum2) {
    const forr = `${topic.title} ${topic.id}`;
    await prisma.comment.create({
      data: {
        text: `Comment for ${topic.title}`,
        topicId: topic.id,
        forReplyId: forr
      },
    });
    kwe+=1;
    const proo = Math.random();
    if (proo >= 0.1) {
      const forrk = `${topic.title} HN ${Math.random()}`;
      const d = `${allS[getRanIntFromMinMax(0,lllee)]}`;
      await prisma.comment.create({
        data: {
          text: d,
          topicId:topic.id,
          forReplyId: forrk,
          replyToId: forr
        }
      })
      kwe+=1;
      const koko = Math.random();
      if (koko > 0.2599999999999) {
        const fooorr = `dollar sign ${topic.description} HN ${Math.random()}`;
        const dd = `${allS[getRanIntFromMinMax(0,lllee)]}`;
        await prisma.comment.create({
          data: {
            text: dd+"99"+`${topic.description}`,
            topicId:topic.id,
            forReplyId:fooorr,
            replyToId:forrk
          }
        })
        kwe+=1;
      }
    }
  }
  console.log("all done for sub 2");

  for (const topic of topicsSubforum3) {
    const firstfor = `${topic.title} ${topic.id}`;
    await prisma.comment.create({
      data: {
        text: `Comment for ${topic.title}`,
        topicId: topic.id,
        forReplyId: firstfor
      },
    });
    kwe+=1;
    const firstPro = Math.random();
    if (firstPro < 0.65) {
      const secondFor = `${Math.random()} +HN ${Math.random()}`;
      const eee = `${allS[getRanIntFromMinMax(0,lllee)]}`
      await prisma.comment.create({
        data: {
          text:eee,
          topicId:topic.id,
          forReplyId:secondFor,
          replyToId:firstfor
        }
      })
      kwe+=1;
      const secondPro = Math.random();
      if (secondPro > 0.88 && secondPro < 0.99) {
        const thirdT = `${Math.random()} ${topic.description} HN ${Math.random()}`;
        const lp = `${allS[getRanIntFromMinMax(0,lllee)]}`
        await prisma.comment.create({
          data: {
            text: "奇淫怪巧 "+lp+" 外強中乾",
            topicId: topic.id,
            forReplyId:thirdT,
            replyToId:secondFor
          }
        })
        kwe+=1;
        const ffT = `${Math.random()} omm HN ${Math.random()+2}`;
        const opo = `${allS[getRanIntFromMinMax(0,lllee)]}`
        await prisma.comment.create({
          data: {
            text: "司馬光 "+opo+" 砸GANG 如別墅",
            topicId: topic.id,
            forReplyId:ffT,
            replyToId:secondFor
          }
        })
        kwe+=1;
        const fiT = `${topic.description} HN ${Math.random()+Math.random()}`;
        const kji = `${allS[getRanIntFromMinMax(0,lllee)]}`
        await prisma.comment.create({
          data: {
            text: kji+"Giant Luffery",
            topicId: topic.id,
            forReplyId:fiT,
            replyToId:secondFor
          }
        })
        kwe+=1;
      }
    }
  }
  console.log("all done for sub 3");

  const bbh = "apslidkfjghtyurewqzmxncbv";

  for (let g = 0;g<4;g++) {
    const randomTopicIndex = Math.floor(Math.random() * topicsSubforum1.length);
    const randomTopic = topicsSubforum1[randomTopicIndex];

    for (let i = 1; i <= 3; i++) {
      const ranFirstFor = `${getRanIntFromMinMax(2,22)}${bbh[getRanIntFromMinMax(0,26)]}${getRanIntFromMinMax(10,222)}`
      await prisma.comment.create({
        data: {
          text: `Additional Comment ${i} for ${randomTopic.title}`,
          topicId: randomTopic.id,
          forReplyId: ranFirstFor
        },
      });
      kwe+=1;
      const mamath = getRanIntFromMinMax(1,3)+Math.random();
      if (mamath<=1.8) {
        const ranSecFor = `${Math.random>(getRanIntFromMinMax(1,2)-Math.random)} mathishardasfun ${getRanIntFromMinMax(1,1000)}`;
        const gt = `${allS[getRanIntFromMinMax(0,lllee)]}`
        await prisma.comment.create({
          data: {
            text:gt+"open fire rollar cooastter",
            topicId:randomTopic.id,
            forReplyId: ranSecFor,
            replyToId:ranFirstFor
          }
        })
        kwe+=1;
        const laslasl = getRanIntFromMinMax(
          getRanIntFromMinMax(1,21),
          getRanIntFromMinMax(21,31)
        );
        var fefejef="abchdjdhjkdiodkslsJAjsjd38920活動馬";
        var running = getRanIntFromMinMax(1,50);
        if (running < laslasl) {
          while (running!==laslasl) {
            const gggi = `${fefejef[getRanIntFromMinMax(0,fefejef.length)]}${overall[getRanIntFromMinMax(0,overall.length)]}${getRanIntFromMinMax(0,100)}${getRanIntFromMinMax(1,23)}${fefejef[getRanIntFromMinMax(0,fefejef.length)]}`;
            await prisma.comment.create({
              data: {
                text: `${i} for ${randomTopic.description}`,
                topicId: randomTopic.id,
                forReplyId: gggi
              },
            });
            kwe+=1;
            running+=1;
          }
        }

      }
    }
  }

  const randomTopicIndexqwe = Math.floor(Math.random() * topicsSubforum3.length);
  const randomTopicw = topicsSubforum3[randomTopicIndexqwe];
  var kdlsjfldsf="BNHJSDFABJfh3w2jdhnjwdfhw";

  for (let i = 0; i <= getRanIntFromMinMax(3,10); i++) {
    await prisma.comment.create({
      data: {
        text: `Add Comment ${i} for ${randomTopicw.title}`,
        topicId: randomTopicw.id,
        forReplyId: `${kdlsjfldsf[getRanIntFromMinMax(0,kdlsjfldsf.length)]}${randomTopicw.id} ${i} ${getRanIntFromMinMax(3,9)-getRanIntFromMinMax(1,2)}${randomTopicw.title}`
      },
    });
    kwe+=1;
  }

  console.log(`Created comments for topics in all subforums`);
  console.log(`total comments: ${kwe}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });