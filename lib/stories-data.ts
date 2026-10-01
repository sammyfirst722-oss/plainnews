import { NewsStory } from './types'

export const INITIAL_STORIES: NewsStory[] = [
  {
    id: 'story-trending-1',
    title: 'Next-Generation Autonomous AI Systems Begin Outperforming Human Experts Across Major Industries',
    slug: 'next-gen-autonomous-ai-systems-outperforming-human-experts',
    simplifiedTitle: 'Next-Gen AI Systems Are Taking Off: What It Actually Means For You',
    source: 'Tech & AI Wire',
    sourceUrl: 'https://news.google.com',
    pubDate: new Date(Date.now() - 1000 * 60 * 20).toISOString(), // 20m ago
    timeAgo: '20m ago',
    category: 'tech',
    categoryLabel: 'AI & Tech',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    originalSummary:
      'The newest wave of autonomous agentic AI models has demonstrated breakthrough capabilities in complex reasoning, software engineering, and continuous data synthesis, sparking massive worldwide adoption and debate.',
    bigPicture:
      'The newest generation of AI models can now handle complex, multi-step tasks completely on their own, transforming how everyday tools and businesses run.',
    whatHappened: [
      'Leading AI research labs released advanced autonomous models capable of executing hours of complex problem-solving without getting stuck.',
      'Unlike older chatbots that only answered questions, these new systems can browse, analyze data, and build full solutions end-to-end.',
      'Major tech companies are racing to integrate these tools into phones, computers, and everyday apps to handle chores automatically.',
    ],
    whyItMatters:
      'This technology will speed up everyday online tasks and make helpful automated assistants accessible to anyone with a smartphone.',
    plainWords: [
      { word: 'Autonomous Agent', meaning: 'An AI that can make its own step-by-step decisions to complete a whole project from start to finish.' },
      { word: 'Reasoning Model', meaning: 'An AI designed to pause and think through tricky problems before giving an answer.' },
    ],
    readTimeMinutes: 2,
    trendingScore: 99,
  },
  {
    id: 'story-trending-2',
    title: 'James Webb Space Telescope Uncovers Surprising Atmospheric Clues on Earth-Sized Exoplanet',
    slug: 'james-webb-telescope-detects-atmosphere-earth-sized-planet',
    simplifiedTitle: 'NASA Space Telescope Detects Clues of Atmosphere on Earth-Sized World',
    source: 'Space & Discoveries',
    sourceUrl: 'https://nasa.gov',
    pubDate: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45m ago
    timeAgo: '45m ago',
    category: 'science',
    categoryLabel: 'Space & Science',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    originalSummary:
      'Deep-space spectroscopic observations from NASA\'s James Webb Space Telescope have revealed unprecedented thermal patterns on an Earth-sized exoplanet, offering the strongest evidence yet of a planetary atmosphere outside our solar system.',
    bigPicture:
      'Astronomers using the James Webb Space Telescope have uncovered evidence that a rocky planet outside our solar system may actually hold an atmosphere.',
    whatHappened: [
      'The James Webb telescope pointed its ultra-sensitive infrared sensors at a rocky world 40 light-years away.',
      'The data showed temperatures on the planet\'s night side are being circulated, which normally only happens when an atmosphere traps heat.',
      'Scientists are now scheduling follow-up observations to analyze the exact gases present in the planet\'s skies.',
    ],
    whyItMatters:
      'Finding atmospheres on rocky worlds brings humanity one step closer to understanding whether life could exist elsewhere in the universe.',
    plainWords: [
      { word: 'Exoplanet', meaning: 'Any planet that orbits a distant star outside our own solar system.' },
      { word: 'Infrared Sensors', meaning: 'Special cameras that see heat radiation instead of visible light.' },
    ],
    readTimeMinutes: 2,
    trendingScore: 95,
  },
  {
    id: 'story-trending-3',
    title: 'New Entertainment Phenomenon Shatters All-Time Global Streaming Records in Opening Weekend',
    slug: 'entertainment-phenomenon-shatters-global-streaming-records',
    simplifiedTitle: 'Viral Hit Show Breaks All-Time Global Streaming Viewership Records',
    source: 'Pop Culture Wire',
    sourceUrl: 'https://news.google.com',
    pubDate: new Date(Date.now() - 1000 * 60 * 80).toISOString(), // 1h ago
    timeAgo: '1h ago',
    category: 'entertainment',
    categoryLabel: 'Pop Culture',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    originalSummary:
      'An unexpected breakout series has shattered international streaming records, racking up over 110 million views across 90 countries in just its first 72 hours of release.',
    bigPicture:
      'A surprise breakout entertainment series has captured worldwide attention, becoming the most-watched debut in streaming history.',
    whatHappened: [
      'The new show debuted simultaneously in over 90 countries and went viral immediately across TikTok, YouTube, and X.',
      'Over 110 million viewers tuned in over the weekend, beating the previous all-time record set in 2024.',
      'Creators announced that fan interest has already triggered plans for extended seasons and spin-off specials.',
    ],
    whyItMatters:
      'It shows how fast modern internet culture can turn an underdog creative project into a global phenomenon in a matter of hours.',
    plainWords: [
      { word: 'Streaming Debut', meaning: 'The very first weekend a new show is released on digital video platforms.' },
    ],
    readTimeMinutes: 2,
    trendingScore: 92,
  },
  {
    id: 'story-trending-4',
    title: 'Major Stock Indexes Surge to Fresh All-Time Highs as Global Productivity Accelerates',
    slug: 'stock-indexes-surge-to-all-time-highs-global-productivity',
    simplifiedTitle: 'Stock Markets Hit Record Highs: Why Portfolios and 401ks Are Surging',
    source: 'Markets & Economy',
    sourceUrl: 'https://news.google.com',
    pubDate: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2h ago
    timeAgo: '2h ago',
    category: 'money',
    categoryLabel: 'Money & Markets',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    originalSummary:
      'Broad equity markets rallied to record territory as cooling inflation prints combined with unprecedented corporate productivity gains from technology investment propelled major indexes higher.',
    bigPicture:
      'Stock markets have climbed to new record peaks as everyday inflation cools down and corporate earnings beat expectations.',
    whatHappened: [
      'The S&P 500, Dow Jones, and Nasdaq all crossed new all-time milestones during strong trading this week.',
      'Inflation numbers came in lower than anticipated, easing pressure on consumer interest rates and borrowing costs.',
      'Retirement accounts and index fund portfolios saw widespread balance boosts across the country.',
    ],
    whyItMatters:
      'A strong market boosts 401(k) retirement funds and investments, giving people more financial flexibility and confidence.',
    plainWords: [
      { word: 'Index Fund', meaning: 'A simple investment bucket that tracks hundreds of top companies at once.' },
      { word: 'Inflation Cooling', meaning: 'Prices are stopping their rapid climb and returning to normal, steady rates.' },
    ],
    readTimeMinutes: 2,
    trendingScore: 89,
  },
  {
    id: 'story-trending-5',
    title: 'Historic Late-Game Rally Crowns New Champions in Thrilling Overtime Finish',
    slug: 'historic-late-game-rally-crowns-champions-thrilling-overtime',
    simplifiedTitle: 'Unbelievable Overtime Rally Sparks One of Sports\' Greatest Comebacks',
    source: 'Sports Wire',
    sourceUrl: 'https://news.google.com',
    pubDate: new Date(Date.now() - 1000 * 60 * 150).toISOString(), // 2h ago
    timeAgo: '2h ago',
    category: 'sports',
    categoryLabel: 'Sports & Records',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    originalSummary:
      'In a championship decider that will be remembered for decades, an underdog team rallied from an improbable deficit in the final minutes to capture the title in sudden-death overtime.',
    bigPicture:
      'An underdog team mounted an unforgettable late rally, overcoming near-impossible odds to win the championship in overtime.',
    whatHappened: [
      'Trailing by multiple scores with only minutes left on the clock, the underdogs mounted a flawless scoring run.',
      'A game-tying play with just seconds remaining sent the stadium and millions of television viewers into absolute pandemonium.',
      'In sudden-death overtime, a legendary defensive play sealed the historic victory.',
    ],
    whyItMatters:
      'It is being celebrated as an instant classic that will be replayed in sports highlight reels for generations to come.',
    plainWords: [
      { word: 'Sudden-Death Overtime', meaning: 'Extra playing time where the very first team to score wins the entire game instantly.' },
    ],
    readTimeMinutes: 2,
    trendingScore: 86,
  },
  {
    id: 'story-trending-6',
    title: 'Massive Ocean Cleanup and Barrier Reef Restoration Projects Cross Milestone Years Ahead of Schedule',
    slug: 'ocean-cleanup-barrier-reef-restoration-milestone-ahead-of-schedule',
    simplifiedTitle: 'Historic Ocean Clean-Up Milestone Achieved Years Ahead of Schedule',
    source: 'Good News Network',
    sourceUrl: 'https://goodnewsnetwork.org',
    pubDate: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3h ago
    timeAgo: '3h ago',
    category: 'good-news',
    categoryLabel: 'Good News',
    imageUrl: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=800&q=80',
    originalSummary:
      'International marine recovery coalitions announced today that modern automated collection fleets and coral micro-fragmentation technologies have restored record stretches of coastal marine life.',
    bigPicture:
      'Autonomous cleanup ships and global conservation teams have cleared millions of pounds of plastic and revitalized damaged coral reefs ahead of target dates.',
    whatHappened: [
      'Specially designed solar-powered collection vessels removed over 5 million pounds of waste from critical ocean zones.',
      'Marine biologists successfully planted thousands of heat-resilient coral fragments that grew 25 times faster than natural rates.',
      'Key marine species and sea turtle populations have begun returning to protected coastal habitats.',
    ],
    whyItMatters:
      'This proves that modern technology and global teamwork can actively reverse environmental damage and protect marine ecosystems.',
    plainWords: [
      { word: 'Micro-Fragmentation', meaning: 'A scientific technique that splits coral into tiny pieces so it grows dozens of times faster.' },
    ],
    readTimeMinutes: 2,
    trendingScore: 83,
  },
]
