import { Article, Category, Author, Tag } from "@/types";

export const authors: Author[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@newssite.com",
    role: "editor",
    avatarUrl: "/avatars/sarah.jpg",
    bio: "Senior Technology Editor with 10+ years covering AI, startups, and digital transformation.",
    socialLinks: { twitter: "sarahchen", linkedin: "sarahchen" },
  },
  {
    id: "2",
    name: "James Rodriguez",
    email: "james@newssite.com",
    role: "author",
    avatarUrl: "/avatars/james.jpg",
    bio: "Business correspondent specializing in markets, fintech, and economic policy.",
    socialLinks: { twitter: "jamesrodriguez" },
  },
  {
    id: "3",
    name: "Aisha Patel",
    email: "aisha@newssite.com",
    role: "author",
    avatarUrl: "/avatars/aisha.jpg",
    bio: "Science and health reporter covering breakthroughs in medicine, climate, and space.",
    socialLinks: { twitter: "aishapatel", linkedin: "aishapatel" },
  },
];

export const categories: Category[] = [
  { id: "1", name: "Technology", slug: "technology", description: "Latest in tech, AI, gadgets, and innovation", metaTitle: "Technology News", metaDescription: "Breaking technology news covering AI, startups, gadgets, and digital innovation.", color: "#3b82f6", sortOrder: 1, isActive: true },
  { id: "2", name: "Business", slug: "business", description: "Markets, economy, startups, and corporate news", metaTitle: "Business News", metaDescription: "Business news covering markets, economy, startups, and corporate developments.", color: "#10b981", sortOrder: 2, isActive: true },
  { id: "3", name: "Science", slug: "science", description: "Discoveries, research, space, and environment", metaTitle: "Science News", metaDescription: "Science news covering discoveries, research, space exploration, and the environment.", color: "#8b5cf6", sortOrder: 3, isActive: true },
  { id: "4", name: "Health", slug: "health", description: "Medicine, wellness, fitness, and public health", metaTitle: "Health News", metaDescription: "Health news covering medicine, wellness, fitness, and public health developments.", color: "#ef4444", sortOrder: 4, isActive: true },
  { id: "5", name: "Sports", slug: "sports", description: "Scores, highlights, transfers, and analysis", metaTitle: "Sports News", metaDescription: "Sports news with scores, highlights, transfers, and expert analysis.", color: "#f59e0b", sortOrder: 5, isActive: true },
  { id: "6", name: "Entertainment", slug: "entertainment", description: "Movies, music, TV, celebrities, and pop culture", metaTitle: "Entertainment News", metaDescription: "Entertainment news covering movies, music, TV shows, and pop culture.", color: "#ec4899", sortOrder: 6, isActive: true },
];

export const subcategories: Category[] = [
  { id: "101", name: "Artificial Intelligence", slug: "ai", description: "AI research, tools, and industry impact", metaTitle: "AI News", metaDescription: "Latest artificial intelligence news and developments.", parentId: "1", color: "#3b82f6", sortOrder: 1, isActive: true },
  { id: "102", name: "Startups", slug: "startups", description: "Startup funding, launches, and founder stories", metaTitle: "Startup News", metaDescription: "Startup news covering funding, launches, and founder stories.", parentId: "1", color: "#3b82f6", sortOrder: 2, isActive: true },
  { id: "103", name: "Gadgets", slug: "gadgets", description: "Consumer electronics, reviews, and product launches", metaTitle: "Gadget News", metaDescription: "Latest gadget reviews, launches, and consumer electronics.", parentId: "1", color: "#3b82f6", sortOrder: 3, isActive: true },
  { id: "201", name: "Stock Market", slug: "stock-market", description: "Market analysis, stock picks, and trading", metaTitle: "Stock Market News", metaDescription: "Stock market analysis, trading insights, and market movements.", parentId: "2", color: "#10b981", sortOrder: 1, isActive: true },
  { id: "202", name: "Economy", slug: "economy", description: "Economic policy, GDP, inflation, and indicators", metaTitle: "Economy News", metaDescription: "Economic news covering policy, inflation, and indicators.", parentId: "2", color: "#10b981", sortOrder: 2, isActive: true },
  { id: "301", name: "Space", slug: "space", description: "Space exploration, astronomy, and NASA updates", metaTitle: "Space News", metaDescription: "Space news covering exploration, astronomy, and NASA.", parentId: "3", color: "#8b5cf6", sortOrder: 1, isActive: true },
  { id: "302", name: "Environment", slug: "environment", description: "Climate change, conservation, and sustainability", metaTitle: "Environment News", metaDescription: "Environment news covering climate change and sustainability.", parentId: "3", color: "#8b5cf6", sortOrder: 2, isActive: true },
  { id: "501", name: "Football", slug: "football", description: "Football news, transfers, scores, and analysis", metaTitle: "Football News", metaDescription: "Football news with transfers, scores, and expert analysis.", parentId: "5", color: "#f59e0b", sortOrder: 1, isActive: true },
  { id: "502", name: "Basketball", slug: "basketball", description: "NBA news, scores, trades, and highlights", metaTitle: "Basketball News", metaDescription: "Basketball and NBA news with scores, trades, and highlights.", parentId: "5", color: "#f59e0b", sortOrder: 2, isActive: true },
];

export function getSubcategories(parentId: string): Category[] {
  return subcategories.filter((sc) => sc.parentId === parentId);
}

export function getSubcategoryBySlug(parentSlug: string, subSlug: string): Category | undefined {
  const parent = categories.find((c) => c.slug === parentSlug);
  if (!parent) return undefined;
  return subcategories.find((sc) => sc.parentId === parent.id && sc.slug === subSlug);
}

export const tags: Tag[] = [
  { id: "1", name: "Artificial Intelligence", slug: "artificial-intelligence", articleCount: 45 },
  { id: "2", name: "Climate Change", slug: "climate-change", articleCount: 32 },
  { id: "3", name: "Stock Market", slug: "stock-market", articleCount: 28 },
  { id: "4", name: "Space", slug: "space", articleCount: 22 },
  { id: "5", name: "Electric Vehicles", slug: "electric-vehicles", articleCount: 18 },
  { id: "6", name: "Cybersecurity", slug: "cybersecurity", articleCount: 15 },
];

const now = new Date();
function daysAgo(n: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
function hoursAgo(n: number): string {
  const d = new Date(now);
  d.setHours(d.getHours() - n);
  return d.toISOString();
}

export const articles: Article[] = [
  {
    id: "1",
    title: "OpenAI Unveils GPT-5 with Unprecedented Reasoning Capabilities",
    slug: "openai-unveils-gpt5-unprecedented-reasoning",
    excerpt: "OpenAI has launched GPT-5, its most advanced AI model yet, featuring breakthrough reasoning abilities that could transform industries from healthcare to finance.",
    content: `OpenAI has officially unveiled GPT-5, marking a significant leap forward in artificial intelligence capabilities. The new model demonstrates unprecedented reasoning abilities that experts say could fundamentally transform how businesses and individuals interact with AI technology.\n\n## Key Improvements\n\nGPT-5 introduces several groundbreaking features that set it apart from its predecessor. The model shows remarkable improvements in logical reasoning, mathematical problem-solving, and contextual understanding.\n\n## Industry Impact\n\nExperts predict that GPT-5's enhanced capabilities will have far-reaching implications across multiple industries. Healthcare providers are already exploring its potential for diagnostic assistance, while financial institutions are evaluating its risk assessment capabilities.\n\n## What This Means for Users\n\nFor everyday users, GPT-5 promises more accurate, nuanced, and helpful AI interactions. The model's improved understanding of context and intent means fewer misunderstandings and more productive conversations.`,
    featuredImageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200",
    featuredImageAlt: "AI neural network visualization representing GPT-5 capabilities",
    author: authors[0],
    category: categories[0],
    tags: [tags[0]],
    status: "published",
    isFeatured: true,
    isBreaking: true,
    isEvergreen: false,
    readingTimeMinutes: 5,
    wordCount: 1200,
    viewCount: 45200,
    shareCount: 3400,
    seoTitle: "OpenAI Unveils GPT-5: Unprecedented AI Reasoning Capabilities",
    seoDescription: "OpenAI launches GPT-5 with breakthrough reasoning abilities. Learn what this means for healthcare, finance, and everyday AI interactions.",
    seoKeywords: ["GPT-5", "OpenAI", "artificial intelligence", "AI reasoning"],
    faq: [
      { question: "What is GPT-5?", answer: "GPT-5 is OpenAI's latest and most advanced large language model, featuring breakthrough reasoning capabilities that surpass its predecessor GPT-4." },
      { question: "How is GPT-5 different from GPT-4?", answer: "GPT-5 demonstrates significant improvements in logical reasoning, mathematical problem-solving, and contextual understanding compared to GPT-4." },
      { question: "When will GPT-5 be available to the public?", answer: "OpenAI has begun rolling out GPT-5 access to ChatGPT Plus subscribers, with broader availability expected in the coming weeks." },
    ],
    publishedAt: hoursAgo(2),
    createdAt: hoursAgo(4),
    updatedAt: hoursAgo(1),
  },
  {
    id: "2",
    title: "Federal Reserve Holds Interest Rates Steady Amid Economic Uncertainty",
    slug: "federal-reserve-holds-interest-rates-steady",
    excerpt: "The Federal Reserve has decided to maintain current interest rates, citing mixed economic signals and ongoing inflation concerns.",
    content: `The Federal Reserve announced today that it will keep interest rates unchanged, maintaining the federal funds rate at its current level. The decision comes amid a complex economic landscape.\n\n## The Decision\n\nFed Chair announced the decision following a two-day meeting of the Federal Open Market Committee. The unanimous vote reflects the committee's cautious approach.\n\n## Market Reaction\n\nFinancial markets responded with measured optimism to the announcement. The S&P 500 rose modestly while Treasury yields remained relatively stable.`,
    featuredImageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200",
    featuredImageAlt: "Federal Reserve building in Washington DC",
    author: authors[1],
    category: categories[1],
    tags: [tags[2]],
    status: "published",
    isFeatured: true,
    isBreaking: false,
    isEvergreen: false,
    readingTimeMinutes: 4,
    wordCount: 980,
    viewCount: 32100,
    shareCount: 2100,
    seoTitle: "Federal Reserve Holds Interest Rates Steady — What It Means",
    seoDescription: "The Fed maintains current interest rates amid economic uncertainty. Analysis of the decision and its market impact.",
    seoKeywords: ["Federal Reserve", "interest rates", "economy", "inflation"],
    publishedAt: hoursAgo(5),
    createdAt: hoursAgo(7),
    updatedAt: hoursAgo(4),
  },
  {
    id: "3",
    title: "NASA's James Webb Telescope Discovers New Earth-Like Exoplanet",
    slug: "nasa-webb-telescope-discovers-earth-like-exoplanet",
    excerpt: "The James Webb Space Telescope has identified a potentially habitable exoplanet with atmospheric conditions remarkably similar to Earth.",
    content: `In a groundbreaking discovery, NASA's James Webb Space Telescope has identified an exoplanet with atmospheric conditions that bear a striking resemblance to Earth.\n\n## The Discovery\n\nThe exoplanet, designated JWST-2026b, orbits within the habitable zone of its host star. Initial spectroscopic analysis reveals the presence of water vapor and carbon dioxide in its atmosphere.\n\n## Scientific Significance\n\nThis discovery represents one of the most promising candidates for extraterrestrial habitability ever identified.`,
    featuredImageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200",
    featuredImageAlt: "James Webb Space Telescope image of distant exoplanet",
    author: authors[2],
    category: categories[2],
    tags: [tags[3]],
    status: "published",
    isFeatured: true,
    isBreaking: false,
    isEvergreen: false,
    readingTimeMinutes: 6,
    wordCount: 1400,
    viewCount: 28700,
    shareCount: 5200,
    seoTitle: "NASA Webb Telescope Discovers Earth-Like Exoplanet",
    seoDescription: "James Webb Space Telescope identifies potentially habitable exoplanet with Earth-like atmospheric conditions.",
    seoKeywords: ["NASA", "James Webb Telescope", "exoplanet", "space discovery"],
    publishedAt: hoursAgo(8),
    createdAt: hoursAgo(10),
    updatedAt: hoursAgo(7),
  },
  {
    id: "4",
    title: "Tesla Unveils Next-Generation Battery Technology at Annual Event",
    slug: "tesla-next-generation-battery-technology",
    excerpt: "Tesla has revealed its latest battery innovation promising 50% more range and 30% faster charging times for its electric vehicle lineup.",
    content: `Tesla showcased its next-generation battery technology at its annual shareholder event, promising significant improvements in range and charging speed.\n\n## The Technology\n\nThe new battery cells utilize a novel solid-state design that increases energy density while reducing manufacturing costs.\n\n## Impact on EVs\n\nThis advancement could accelerate the adoption of electric vehicles by addressing two of the biggest consumer concerns: range anxiety and charging time.`,
    featuredImageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200",
    featuredImageAlt: "Electric vehicle battery technology close-up",
    author: authors[0],
    category: categories[0],
    tags: [tags[4]],
    status: "published",
    isFeatured: false,
    isBreaking: false,
    isEvergreen: false,
    readingTimeMinutes: 4,
    wordCount: 950,
    viewCount: 19800,
    shareCount: 1800,
    seoTitle: "Tesla Unveils Next-Gen Battery: 50% More Range",
    seoDescription: "Tesla reveals next-generation battery technology with 50% more range and 30% faster charging at annual event.",
    seoKeywords: ["Tesla", "battery technology", "electric vehicles", "EV range"],
    publishedAt: daysAgo(1),
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: "5",
    title: "Global Cybersecurity Spending to Exceed $200 Billion in 2026",
    slug: "global-cybersecurity-spending-200-billion-2026",
    excerpt: "A new report projects worldwide cybersecurity spending will surpass $200 billion this year as organizations face increasingly sophisticated threats.",
    content: `Global cybersecurity spending is on track to exceed $200 billion in 2026, according to a comprehensive new industry report.\n\n## Key Drivers\n\nThe surge in spending is driven by the increasing sophistication of cyber threats, regulatory requirements, and the expanding attack surface created by remote work and cloud adoption.\n\n## Industry Breakdown\n\nFinancial services and healthcare lead in cybersecurity investment, with both sectors facing heightened regulatory scrutiny and targeting by threat actors.`,
    featuredImageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200",
    featuredImageAlt: "Cybersecurity digital lock and network protection concept",
    author: authors[1],
    category: categories[0],
    tags: [tags[5]],
    status: "published",
    isFeatured: false,
    isBreaking: false,
    isEvergreen: false,
    readingTimeMinutes: 3,
    wordCount: 820,
    viewCount: 12400,
    shareCount: 890,
    seoTitle: "Cybersecurity Spending to Exceed $200B in 2026",
    seoDescription: "Global cybersecurity spending projected to surpass $200 billion in 2026. Key drivers and industry breakdown.",
    seoKeywords: ["cybersecurity", "spending", "cyber threats", "security market"],
    publishedAt: daysAgo(1),
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
  },
  {
    id: "6",
    title: "WHO Reports Major Breakthrough in Malaria Vaccine Development",
    slug: "who-breakthrough-malaria-vaccine-development",
    excerpt: "The World Health Organization announces a new malaria vaccine showing 80% efficacy in clinical trials, potentially saving millions of lives annually.",
    content: `The World Health Organization has announced a significant breakthrough in malaria vaccine development, with a new candidate showing 80% efficacy in Phase 3 clinical trials.\n\n## The Vaccine\n\nThe new vaccine, developed through a global research collaboration, targets the parasite at multiple stages of infection.\n\n## Global Impact\n\nMalaria kills over 600,000 people annually, primarily children in sub-Saharan Africa. An 80% effective vaccine could prevent hundreds of thousands of deaths each year.`,
    featuredImageUrl: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=1200",
    featuredImageAlt: "Medical research scientist working on vaccine development",
    author: authors[2],
    category: categories[3],
    tags: [],
    status: "published",
    isFeatured: false,
    isBreaking: false,
    isEvergreen: false,
    readingTimeMinutes: 4,
    wordCount: 1050,
    viewCount: 15600,
    shareCount: 2300,
    seoTitle: "WHO: Major Malaria Vaccine Breakthrough — 80% Efficacy",
    seoDescription: "WHO announces new malaria vaccine with 80% efficacy in clinical trials. Could save millions of lives annually.",
    seoKeywords: ["malaria vaccine", "WHO", "public health", "clinical trials"],
    publishedAt: daysAgo(2),
    createdAt: daysAgo(3),
    updatedAt: daysAgo(2),
  },
  {
    id: "7",
    title: "Champions League Quarter-Final Draw Produces Blockbuster Matchups",
    slug: "champions-league-quarter-final-draw-blockbuster",
    excerpt: "The UEFA Champions League quarter-final draw has produced thrilling matchups including a repeat of last year's dramatic semifinal.",
    content: `The UEFA Champions League quarter-final draw has set up some mouth-watering encounters for football fans worldwide.\n\n## The Draw\n\nThe draw produced several high-profile matchups that promise exciting football over the coming weeks.\n\n## Key Matchups\n\nFootball experts are already debating which ties will produce the most drama, with several featuring teams with recent rivalry history.`,
    featuredImageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200",
    featuredImageAlt: "Champions League football stadium under lights",
    author: authors[1],
    category: categories[4],
    tags: [],
    status: "published",
    isFeatured: false,
    isBreaking: false,
    isEvergreen: false,
    readingTimeMinutes: 3,
    wordCount: 780,
    viewCount: 22300,
    shareCount: 3100,
    seoTitle: "Champions League QF Draw: Blockbuster Matchups Revealed",
    seoDescription: "UEFA Champions League quarter-final draw produces thrilling matchups. Full draw details and analysis.",
    seoKeywords: ["Champions League", "quarter-final draw", "UEFA", "football"],
    publishedAt: daysAgo(2),
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    id: "8",
    title: "Streaming Wars Heat Up as Major Studios Announce Platform Mergers",
    slug: "streaming-wars-major-studios-platform-mergers",
    excerpt: "The entertainment landscape is shifting dramatically as two major streaming platforms announce plans to merge their content libraries.",
    content: `The streaming industry is undergoing a seismic shift as major studios explore mergers and partnerships to compete in an increasingly crowded market.\n\n## The Merger\n\nTwo major streaming platforms have announced plans to combine their content libraries and subscriber bases.\n\n## What This Means for Consumers\n\nSubscribers can expect changes in pricing, content availability, and the overall streaming experience.`,
    featuredImageUrl: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=1200",
    featuredImageAlt: "Person watching streaming content on smart TV",
    author: authors[0],
    category: categories[5],
    tags: [],
    status: "published",
    isFeatured: false,
    isBreaking: false,
    isEvergreen: false,
    readingTimeMinutes: 4,
    wordCount: 920,
    viewCount: 18100,
    shareCount: 1500,
    seoTitle: "Streaming Wars: Major Platform Mergers Announced",
    seoDescription: "Major streaming platforms announce merger plans. How this affects subscribers and the entertainment industry.",
    seoKeywords: ["streaming", "platform merger", "entertainment", "streaming wars"],
    publishedAt: daysAgo(3),
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  },
];

export function getArticlesByCategory(categorySlug: string): Article[] {
  return articles.filter((a) => a.category.slug === categorySlug && a.status === "published");
}

export function getFeaturedArticles(): Article[] {
  return articles.filter((a) => a.isFeatured && a.status === "published");
}

export function getBreakingNews(): Article[] {
  return articles.filter((a) => a.isBreaking && a.status === "published");
}

export function getTrendingArticles(limit = 5): Article[] {
  return [...articles]
    .filter((a) => a.status === "published")
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit);
}

export function getLatestArticles(limit = 10): Article[] {
  return [...articles]
    .filter((a) => a.status === "published")
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  return articles
    .filter((a) => a.id !== article.id && a.category.id === article.category.id && a.status === "published")
    .slice(0, limit);
}

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find((a) => a.name.toLowerCase().replace(/\s+/g, "-") === slug);
}

export function getArticlesByAuthor(authorId: string): Article[] {
  return articles.filter((a) => a.author.id === authorId && a.status === "published");
}
