import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma";
import { createHash } from "crypto";
import path from "node:path";

const dbPath = path.join(__dirname, "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

const now = new Date();
function daysAgo(n: number): Date {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d;
}
function hoursAgo(n: number): Date {
  const d = new Date(now);
  d.setHours(d.getHours() - n);
  return d;
}

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.articleTag.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.session.deleteMany();
  await prisma.article.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.newsletter.deleteMany();
  await prisma.user.deleteMany();

  // --- Users ---
  const sarah = await prisma.user.create({
    data: {
      id: "u1",
      email: "sarah@newssite.com",
      name: "Sarah Chen",
      password: hashPassword("admin123"),
      role: "editor",
      avatarUrl: "/avatars/sarah.jpg",
      bio: "Senior Technology Editor with 10+ years covering AI, startups, and digital transformation.",
      socialLinks: JSON.stringify({ twitter: "sarahchen", linkedin: "sarahchen" }),
    },
  });
  const james = await prisma.user.create({
    data: {
      id: "u2",
      email: "james@newssite.com",
      name: "James Rodriguez",
      password: hashPassword("admin123"),
      role: "author",
      avatarUrl: "/avatars/james.jpg",
      bio: "Business correspondent specializing in markets, fintech, and economic policy.",
      socialLinks: JSON.stringify({ twitter: "jamesrodriguez" }),
    },
  });
  const aisha = await prisma.user.create({
    data: {
      id: "u3",
      email: "aisha@newssite.com",
      name: "Aisha Patel",
      password: hashPassword("admin123"),
      role: "author",
      avatarUrl: "/avatars/aisha.jpg",
      bio: "Science and health reporter covering breakthroughs in medicine, climate, and space.",
      socialLinks: JSON.stringify({ twitter: "aishapatel", linkedin: "aishapatel" }),
    },
  });
  // Admin user
  await prisma.user.create({
    data: {
      id: "u0",
      email: "admin@newssite.com",
      name: "Admin",
      password: hashPassword("admin123"),
      role: "admin",
      bio: "Site administrator",
    },
  });

  // --- Categories ---
  const tech = await prisma.category.create({ data: { id: "c1", name: "Technology", slug: "technology", description: "Latest in tech, AI, gadgets, and innovation", metaTitle: "Technology News", metaDescription: "Breaking technology news covering AI, startups, gadgets, and digital innovation.", color: "#3b82f6", sortOrder: 1 } });
  const biz = await prisma.category.create({ data: { id: "c2", name: "Business", slug: "business", description: "Markets, economy, startups, and corporate news", metaTitle: "Business News", metaDescription: "Business news covering markets, economy, startups, and corporate developments.", color: "#10b981", sortOrder: 2 } });
  const science = await prisma.category.create({ data: { id: "c3", name: "Science", slug: "science", description: "Discoveries, research, space, and environment", metaTitle: "Science News", metaDescription: "Science news covering discoveries, research, space exploration, and the environment.", color: "#8b5cf6", sortOrder: 3 } });
  const health = await prisma.category.create({ data: { id: "c4", name: "Health", slug: "health", description: "Medicine, wellness, fitness, and public health", metaTitle: "Health News", metaDescription: "Health news covering medicine, wellness, fitness, and public health developments.", color: "#ef4444", sortOrder: 4 } });
  const sports = await prisma.category.create({ data: { id: "c5", name: "Sports", slug: "sports", description: "Scores, highlights, transfers, and analysis", metaTitle: "Sports News", metaDescription: "Sports news with scores, highlights, transfers, and expert analysis.", color: "#f59e0b", sortOrder: 5 } });
  const ent = await prisma.category.create({ data: { id: "c6", name: "Entertainment", slug: "entertainment", description: "Movies, music, TV, celebrities, and pop culture", metaTitle: "Entertainment News", metaDescription: "Entertainment news covering movies, music, TV shows, and pop culture.", color: "#ec4899", sortOrder: 6 } });

  // Subcategories
  await prisma.category.createMany({
    data: [
      { id: "sc1", name: "Artificial Intelligence", slug: "ai", description: "AI research, tools, and industry impact", parentId: tech.id, color: "#3b82f6", sortOrder: 1 },
      { id: "sc2", name: "Startups", slug: "startups", description: "Startup funding, launches, and founder stories", parentId: tech.id, color: "#3b82f6", sortOrder: 2 },
      { id: "sc3", name: "Gadgets", slug: "gadgets", description: "Consumer electronics, reviews, and product launches", parentId: tech.id, color: "#3b82f6", sortOrder: 3 },
      { id: "sc4", name: "Stock Market", slug: "stock-market", description: "Market analysis, stock picks, and trading", parentId: biz.id, color: "#10b981", sortOrder: 1 },
      { id: "sc5", name: "Economy", slug: "economy", description: "Economic policy, GDP, inflation, and indicators", parentId: biz.id, color: "#10b981", sortOrder: 2 },
      { id: "sc6", name: "Space", slug: "space", description: "Space exploration, astronomy, and NASA updates", parentId: science.id, color: "#8b5cf6", sortOrder: 1 },
      { id: "sc7", name: "Environment", slug: "environment", description: "Climate change, conservation, and sustainability", parentId: science.id, color: "#8b5cf6", sortOrder: 2 },
      { id: "sc8", name: "Football", slug: "football", description: "Football news, transfers, scores, and analysis", parentId: sports.id, color: "#f59e0b", sortOrder: 1 },
      { id: "sc9", name: "Basketball", slug: "basketball", description: "NBA news, scores, trades, and highlights", parentId: sports.id, color: "#f59e0b", sortOrder: 2 },
    ],
  });

  // --- Tags ---
  await prisma.tag.createMany({
    data: [
      { id: "t1", name: "Artificial Intelligence", slug: "artificial-intelligence", articleCount: 3 },
      { id: "t2", name: "Climate Change", slug: "climate-change", articleCount: 0 },
      { id: "t3", name: "Stock Market", slug: "stock-market", articleCount: 1 },
      { id: "t4", name: "Space", slug: "space", articleCount: 1 },
      { id: "t5", name: "Electric Vehicles", slug: "electric-vehicles", articleCount: 1 },
      { id: "t6", name: "Cybersecurity", slug: "cybersecurity", articleCount: 1 },
    ],
  });

  // --- Articles ---
  const articlesData = [
    {
      id: "a1", title: "OpenAI Unveils GPT-5 with Unprecedented Reasoning Capabilities",
      slug: "openai-unveils-gpt5-unprecedented-reasoning",
      excerpt: "OpenAI has launched GPT-5, its most advanced AI model yet, featuring breakthrough reasoning abilities that could transform industries from healthcare to finance.",
      content: `OpenAI has officially unveiled GPT-5, marking a significant leap forward in artificial intelligence capabilities. The new model demonstrates unprecedented reasoning abilities that experts say could fundamentally transform how businesses and individuals interact with AI technology.\n\n## Key Improvements\n\nGPT-5 introduces several groundbreaking features that set it apart from its predecessor. The model shows remarkable improvements in logical reasoning, mathematical problem-solving, and contextual understanding.\n\n## Industry Impact\n\nExperts predict that GPT-5's enhanced capabilities will have far-reaching implications across multiple industries. Healthcare providers are already exploring its potential for diagnostic assistance, while financial institutions are evaluating its risk assessment capabilities.\n\n## What This Means for Users\n\nFor everyday users, GPT-5 promises more accurate, nuanced, and helpful AI interactions. The model's improved understanding of context and intent means fewer misunderstandings and more productive conversations.`,
      featuredImageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200",
      featuredImageAlt: "AI neural network visualization representing GPT-5 capabilities",
      authorId: sarah.id, categoryId: tech.id, status: "published",
      isFeatured: true, isBreaking: true, readingTime: 5, wordCount: 1200, viewCount: 45200, shareCount: 3400,
      seoTitle: "OpenAI Unveils GPT-5: Unprecedented AI Reasoning Capabilities",
      seoDescription: "OpenAI launches GPT-5 with breakthrough reasoning abilities.",
      seoKeywords: "GPT-5,OpenAI,artificial intelligence,AI reasoning",
      faq: JSON.stringify([
        { question: "What is GPT-5?", answer: "GPT-5 is OpenAI's latest and most advanced large language model, featuring breakthrough reasoning capabilities that surpass its predecessor GPT-4." },
        { question: "How is GPT-5 different from GPT-4?", answer: "GPT-5 demonstrates significant improvements in logical reasoning, mathematical problem-solving, and contextual understanding compared to GPT-4." },
        { question: "When will GPT-5 be available to the public?", answer: "OpenAI has begun rolling out GPT-5 access to ChatGPT Plus subscribers, with broader availability expected in the coming weeks." },
      ]),
      publishedAt: hoursAgo(2), createdAt: hoursAgo(4), updatedAt: hoursAgo(1),
      tagIds: ["t1"],
    },
    {
      id: "a2", title: "Federal Reserve Holds Interest Rates Steady Amid Economic Uncertainty",
      slug: "federal-reserve-holds-interest-rates-steady",
      excerpt: "The Federal Reserve has decided to maintain current interest rates, citing mixed economic signals and ongoing inflation concerns.",
      content: `The Federal Reserve announced today that it will keep interest rates unchanged.\n\n## The Decision\n\nFed Chair announced the decision following a two-day meeting of the Federal Open Market Committee.\n\n## Market Reaction\n\nFinancial markets responded with measured optimism.`,
      featuredImageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200",
      featuredImageAlt: "Federal Reserve building in Washington DC",
      authorId: james.id, categoryId: biz.id, status: "published",
      isFeatured: true, isBreaking: false, readingTime: 4, wordCount: 980, viewCount: 32100, shareCount: 2100,
      seoTitle: "Federal Reserve Holds Interest Rates Steady",
      seoDescription: "The Fed maintains current interest rates amid economic uncertainty.",
      seoKeywords: "Federal Reserve,interest rates,economy,inflation",
      publishedAt: hoursAgo(5), createdAt: hoursAgo(7), updatedAt: hoursAgo(4),
      tagIds: ["t3"],
    },
    {
      id: "a3", title: "NASA's James Webb Telescope Discovers New Earth-Like Exoplanet",
      slug: "nasa-webb-telescope-discovers-earth-like-exoplanet",
      excerpt: "The James Webb Space Telescope has identified a potentially habitable exoplanet with atmospheric conditions remarkably similar to Earth.",
      content: `NASA's James Webb Space Telescope has identified an exoplanet with atmospheric conditions that bear a striking resemblance to Earth.\n\n## The Discovery\n\nThe exoplanet, designated JWST-2026b, orbits within the habitable zone of its host star.\n\n## Scientific Significance\n\nThis discovery represents one of the most promising candidates for extraterrestrial habitability ever identified.`,
      featuredImageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200",
      featuredImageAlt: "James Webb Space Telescope image of distant exoplanet",
      authorId: aisha.id, categoryId: science.id, status: "published",
      isFeatured: true, isBreaking: false, readingTime: 6, wordCount: 1400, viewCount: 28700, shareCount: 5200,
      seoTitle: "NASA Webb Telescope Discovers Earth-Like Exoplanet",
      seoDescription: "James Webb Space Telescope identifies potentially habitable exoplanet.",
      seoKeywords: "NASA,James Webb Telescope,exoplanet,space discovery",
      publishedAt: hoursAgo(8), createdAt: hoursAgo(10), updatedAt: hoursAgo(7),
      tagIds: ["t4"],
    },
    {
      id: "a4", title: "Tesla Unveils Next-Generation Battery Technology at Annual Event",
      slug: "tesla-next-generation-battery-technology",
      excerpt: "Tesla has revealed its latest battery innovation promising 50% more range and 30% faster charging times.",
      content: `Tesla showcased its next-generation battery technology.\n\n## The Technology\n\nThe new battery cells utilize a novel solid-state design.\n\n## Impact on EVs\n\nThis advancement could accelerate EV adoption.`,
      featuredImageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200",
      featuredImageAlt: "Electric vehicle battery technology close-up",
      authorId: sarah.id, categoryId: tech.id, status: "published",
      isFeatured: false, isBreaking: false, readingTime: 4, wordCount: 950, viewCount: 19800, shareCount: 1800,
      seoTitle: "Tesla Unveils Next-Gen Battery: 50% More Range",
      seoDescription: "Tesla reveals next-generation battery technology.",
      seoKeywords: "Tesla,battery technology,electric vehicles,EV range",
      publishedAt: daysAgo(1), createdAt: daysAgo(1), updatedAt: daysAgo(1),
      tagIds: ["t5"],
    },
    {
      id: "a5", title: "Global Cybersecurity Spending to Exceed $200 Billion in 2026",
      slug: "global-cybersecurity-spending-200-billion-2026",
      excerpt: "Worldwide cybersecurity spending will surpass $200 billion this year as organizations face increasingly sophisticated threats.",
      content: `Global cybersecurity spending is on track to exceed $200 billion in 2026.\n\n## Key Drivers\n\nThe surge is driven by increasing sophistication of cyber threats.\n\n## Industry Breakdown\n\nFinancial services and healthcare lead in cybersecurity investment.`,
      featuredImageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200",
      featuredImageAlt: "Cybersecurity digital lock and network protection concept",
      authorId: james.id, categoryId: tech.id, status: "published",
      isFeatured: false, isBreaking: false, readingTime: 3, wordCount: 820, viewCount: 12400, shareCount: 890,
      seoTitle: "Cybersecurity Spending to Exceed $200B in 2026",
      seoDescription: "Global cybersecurity spending projected to surpass $200 billion.",
      seoKeywords: "cybersecurity,spending,cyber threats,security market",
      publishedAt: daysAgo(1), createdAt: daysAgo(2), updatedAt: daysAgo(1),
      tagIds: ["t6"],
    },
    {
      id: "a6", title: "WHO Reports Major Breakthrough in Malaria Vaccine Development",
      slug: "who-breakthrough-malaria-vaccine-development",
      excerpt: "A new malaria vaccine showing 80% efficacy in clinical trials could save millions of lives annually.",
      content: `The WHO has announced a significant breakthrough in malaria vaccine development.\n\n## The Vaccine\n\nThe new vaccine targets the parasite at multiple stages of infection.\n\n## Global Impact\n\nMalaria kills over 600,000 people annually.`,
      featuredImageUrl: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=1200",
      featuredImageAlt: "Medical research scientist working on vaccine development",
      authorId: aisha.id, categoryId: health.id, status: "published",
      isFeatured: false, isBreaking: false, readingTime: 4, wordCount: 1050, viewCount: 15600, shareCount: 2300,
      seoTitle: "WHO: Major Malaria Vaccine Breakthrough — 80% Efficacy",
      seoDescription: "WHO announces new malaria vaccine with 80% efficacy.",
      seoKeywords: "malaria vaccine,WHO,public health,clinical trials",
      publishedAt: daysAgo(2), createdAt: daysAgo(3), updatedAt: daysAgo(2),
      tagIds: [],
    },
    {
      id: "a7", title: "Champions League Quarter-Final Draw Produces Blockbuster Matchups",
      slug: "champions-league-quarter-final-draw-blockbuster",
      excerpt: "The UEFA Champions League quarter-final draw has produced thrilling matchups.",
      content: `The UEFA Champions League quarter-final draw has set up some mouth-watering encounters.\n\n## The Draw\n\nThe draw produced several high-profile matchups.\n\n## Key Matchups\n\nExperts are debating which ties will produce the most drama.`,
      featuredImageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200",
      featuredImageAlt: "Champions League football stadium under lights",
      authorId: james.id, categoryId: sports.id, status: "published",
      isFeatured: false, isBreaking: false, readingTime: 3, wordCount: 780, viewCount: 22300, shareCount: 3100,
      seoTitle: "Champions League QF Draw: Blockbuster Matchups Revealed",
      seoDescription: "UEFA Champions League quarter-final draw produces thrilling matchups.",
      seoKeywords: "Champions League,quarter-final draw,UEFA,football",
      publishedAt: daysAgo(2), createdAt: daysAgo(2), updatedAt: daysAgo(2),
      tagIds: [],
    },
    {
      id: "a8", title: "Streaming Wars Heat Up as Major Studios Announce Platform Mergers",
      slug: "streaming-wars-major-studios-platform-mergers",
      excerpt: "Two major streaming platforms announce plans to merge their content libraries.",
      content: `The streaming industry is undergoing a seismic shift.\n\n## The Merger\n\nTwo major streaming platforms have announced plans to combine.\n\n## What This Means for Consumers\n\nSubscribers can expect changes in pricing and content availability.`,
      featuredImageUrl: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=1200",
      featuredImageAlt: "Person watching streaming content on smart TV",
      authorId: sarah.id, categoryId: ent.id, status: "published",
      isFeatured: false, isBreaking: false, readingTime: 4, wordCount: 920, viewCount: 18100, shareCount: 1500,
      seoTitle: "Streaming Wars: Major Platform Mergers Announced",
      seoDescription: "Major streaming platforms announce merger plans.",
      seoKeywords: "streaming,platform merger,entertainment,streaming wars",
      publishedAt: daysAgo(3), createdAt: daysAgo(3), updatedAt: daysAgo(3),
      tagIds: [],
    },
  ];

  for (const { tagIds, ...data } of articlesData) {
    await prisma.article.create({ data });
    if (tagIds.length > 0) {
      await prisma.articleTag.createMany({
        data: tagIds.map((tagId) => ({ articleId: data.id, tagId })),
      });
    }
  }

  console.log("Seeded: 4 users, 15 categories, 6 tags, 8 articles");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
