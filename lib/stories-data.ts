import { NewsStory } from './types'

export const INITIAL_STORIES: NewsStory[] = [
  {
    id: 'story-1',
    title: 'Social Security Announces Cost-of-Living Adjustment (COLA) for Upcoming Year',
    slug: 'social-security-announces-cost-of-living-adjustment-cola-for-upcoming-year',
    simplifiedTitle: 'Social Security Checks Are Increasing: What You Need to Know',
    source: 'Associated Press',
    sourceUrl: 'https://apnews.com',
    pubDate: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35m ago
    timeAgo: '35m ago',
    category: 'money',
    categoryLabel: 'Money & Retirement',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    originalSummary:
      'The Social Security Administration has released its annual Cost-of-Living Adjustment (COLA) calculations based on third-quarter CPI-W metrics, providing an increase for millions of retirees facing sticky inflation in healthcare and grocery sectors.',
    bigPicture:
      'Starting in January, monthly Social Security benefits will increase by about $50 to $65 per month for the average retired worker.',
    whatHappened: [
      'The government adjusts Social Security checks once a year so payments keep up with rising prices on food, utilities, and medicine.',
      'The new raise takes effect with the January check for retirees and late December for SSI recipients.',
      'Medicare Part B premiums will also update soon, which comes directly out of your monthly benefit payment before it hits your bank account.',
    ],
    whyItMatters:
      'If you receive Social Security or plan to soon, you will see a slightly larger deposit in your account. Be sure to check your Medicare premium changes in November to calculate your true take-home raise.',
    plainWords: [
      { word: 'COLA', meaning: 'Cost-of-Living Adjustment — an automatic pay bump to help keep up with higher prices.' },
      { word: 'CPI-W', meaning: 'The government index that measures how much everyday prices changed over the year.' },
    ],
    readTimeMinutes: 2,
  },
  {
    id: 'story-2',
    title: 'Medicare Cap on Out-of-Pocket Prescription Drug Costs Begins Showing Major Savings',
    slug: 'medicare-cap-on-out-of-pocket-prescription-drug-costs-begins-showing-major-savin',
    simplifiedTitle: 'Prescription Drug Costs Now Capped: How Seniors Are Saving Thousands',
    source: 'NPR Health',
    sourceUrl: 'https://npr.org',
    pubDate: new Date(Date.now() - 1000 * 60 * 75).toISOString(), // 1h ago
    timeAgo: '1h ago',
    category: 'health',
    categoryLabel: 'Health & Wellness',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    originalSummary:
      'A landmark provision in the Inflation Reduction Act capping catastrophic out-of-pocket prescription medication expenses at $2,000 annually has relieved financial distress for patients taking specialty biologics, oncology therapies, and diabetes treatments.',
    bigPicture:
      'People on Medicare will not have to pay more than $2,000 total out of their own pocket for prescription medicines this year.',
    whatHappened: [
      'In the past, seniors on expensive drugs (such as cancer medications or heart treatments) could spend $5,000 to $12,000 each year at the pharmacy.',
      'Under the new law, once your out-of-pocket spending reaches the $2,000 limit, Medicare Part D covers 100% of your covered medicines for the rest of the year.',
      'Pharmacies now also allow you to spread that $2,000 cost out in equal monthly payments across the year rather than paying huge sums all at once in January.',
    ],
    whyItMatters:
      'If you or a spouse take daily maintenance or specialty medications, your monthly pharmacy bills will have a predictable ceiling. Ask your pharmacist about the "Medicare Prescription Payment Plan" if you want to spread payments out.',
    plainWords: [
      { word: 'Out-of-Pocket', meaning: 'Money you pay yourself with your own cash, before insurance pays the rest.' },
      { word: 'Part D', meaning: 'The specific section of Medicare that pays for prescription pills and pharmacy drugs.' },
    ],
    readTimeMinutes: 2,
  },
  {
    id: 'story-3',
    title: 'FTC Issues Urgent Warning Over AI Voice Cloning Scams Targeting Family Members',
    slug: 'ftc-issues-urgent-warning-over-ai-voice-cloning-scams-targeting-family-members',
    simplifiedTitle: 'Watch Out for Fake Phone Calls Using AI to Copy Family Voices',
    source: 'BBC Technology',
    sourceUrl: 'https://bbc.com',
    pubDate: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2h ago
    timeAgo: '2h ago',
    category: 'tech',
    categoryLabel: 'Tech Made Simple',
    imageUrl: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=800&q=80',
    originalSummary:
      'Federal regulators warn that cybercriminals are utilizing generative artificial intelligence to sample brief audio clips from social media videos, fabricating hyper-realistic distress calls pretending to be grandchildren or siblings asking for urgent wire transfers.',
    bigPicture:
      'Scammers can now use computer software to mimic your child or grandchild’s voice on the phone, claiming they are in trouble and need emergency money.',
    whatHappened: [
      'A scammer takes a 5-second video from Facebook or Instagram and runs it through an AI tool that copies how that person speaks.',
      'They call parents or grandparents pretending to be in a car accident or jail, begging for urgent money via gift cards, wire transfer, or cryptocurrency.',
      'The voice sounds remarkably real, making it easy to panic and send money before double-checking.',
    ],
    whyItMatters:
      'Never send money immediately when someone calls in a panic. Hang up right away, take a breath, and call that family member directly on their known phone number or call another relative to confirm.',
    plainWords: [
      { word: 'Voice Cloning', meaning: 'A computer program that copies someone’s voice so well it sounds like them on the phone.' },
      { word: 'Wire Transfer', meaning: 'Sending money directly and permanently from your bank account with no way to get it back.' },
    ],
    readTimeMinutes: 2,
  },
  {
    id: 'story-4',
    title: 'New Study: 20 Minutes of Daily Brisk Walking Slashes Joint Stiffness and Heart Risk After 45',
    slug: 'new-study-20-minutes-of-daily-brisk-walking-slashes-joint-stiffness-and-heart-ri',
    simplifiedTitle: 'A Simple 20-Minute Daily Walk Does Wonders for Joints and Heart',
    source: 'Reuters Health',
    sourceUrl: 'https://reuters.com',
    pubDate: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3h ago
    timeAgo: '3h ago',
    category: 'health',
    categoryLabel: 'Health & Wellness',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    originalSummary:
      'A ten-year longitudinal clinical review tracking over 25,000 participants aged 45 to 75 revealed that modest, consistent low-impact cardiovascular activity correlates with a 38% decrease in osteoarthritis progression and reduced arterial stiffness.',
    bigPicture:
      'You don’t need an intense gym routine — walking for just 20 minutes a day keeps your joints lubricated and strengthens your heart as you age.',
    whatHappened: [
      'Doctors tracked 25,000 adults over ten years and found that those who took a brisk daily walk had significantly less knee and hip pain.',
      'Moving your joints produces natural fluid that cushions cartilage, like oil on a hinge.',
      'The benefits were nearly identical whether people walked 20 minutes all at once or broke it into two 10-minute walks (morning and evening).',
    ],
    whyItMatters:
      'If your knees or back feel stiff in the morning, a gentle walk around the block or inside a shopping mall is one of the most effective, free medicines available.',
    plainWords: [
      { word: 'Cartilage', meaning: 'The rubbery padding between your bones that keeps them from rubbing together.' },
      { word: 'Low-Impact', meaning: 'Exercise that is gentle on your joints and does not involve jumping or pounding.' },
    ],
    readTimeMinutes: 2,
  },
  {
    id: 'story-5',
    title: 'Homeowners Over 50 Find Major Energy Savings with State Heat Pump and Insulation Rebates',
    slug: 'homeowners-over-50-find-major-energy-savings-with-state-heat-pump-and-insulation',
    simplifiedTitle: 'State and Federal Rebates Make Home Heating and Cooling Much Cheaper',
    source: 'CNBC',
    sourceUrl: 'https://cnbc.com',
    pubDate: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4h ago
    timeAgo: '4h ago',
    category: 'living',
    categoryLabel: 'Home & Living',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    originalSummary:
      'Clean energy efficiency tax incentives and utility rebates are accelerating consumer adoption of modern heat pumps, window sealing, and attic insulation upgrades, yielding up to 30% reduction on monthly electric bills.',
    bigPicture:
      'Federal and local utility programs now offer up to $2,000 to $8,000 in discounts to help you upgrade home insulation, windows, or heating systems.',
    whatHappened: [
      'Older air conditioning and furnace units waste a lot of electricity and fuel during summer heatwaves and winter cold snaps.',
      'New electric heat pumps provide both air conditioning in the summer and warmth in the winter using far less power.',
      'Programs like the 25C Energy Efficient Home Improvement Credit allow you to subtract thousands of dollars from your taxes when updating equipment.',
    ],
    whyItMatters:
      'If your AC or furnace is more than 12 years old, check with your electric company or a licensed contractor before it breaks — you could save thousands off the replacement cost.',
    plainWords: [
      { word: 'Heat Pump', meaning: 'A modern, quiet electric system that both cools your home in summer and heats it in winter.' },
      { word: 'Tax Credit', meaning: 'A dollar-for-dollar reduction in the taxes you owe to the government.' },
    ],
    readTimeMinutes: 2,
  },
  {
    id: 'story-6',
    title: 'High-Yield Savings Accounts Remain Above 4.5%: How to Avoid Leaving Money in Near-Zero Checking',
    slug: 'high-yield-savings-accounts-remain-above-4-5-how-to-avoid-leaving-money-in-near-',
    simplifiedTitle: 'How to Earn 4% to 5% on Your Emergency Cash Right Now',
    source: 'Wall Street Journal',
    sourceUrl: 'https://wsj.com',
    pubDate: new Date(Date.now() - 1000 * 60 * 300).toISOString(), // 5h ago
    timeAgo: '5h ago',
    category: 'money',
    categoryLabel: 'Money & Retirement',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
    originalSummary:
      'Despite potential monetary policy shifts by the Federal Reserve, top-tier FDIC-insured online banks and credit unions continue paying annualized percentage yields in excess of 4.50% on liquid savings deposits.',
    bigPicture:
      'Traditional big banks still pay almost zero interest on checking accounts, but safe FDIC-insured savings accounts are paying $400 to $500 a year for every $10,000 saved.',
    whatHappened: [
      'Most people leave their emergency money sitting in regular checking or old savings accounts that pay 0.01% interest.',
      'Online banks and credit unions offer High-Yield Savings Accounts (HYSA) that pay between 4% and 5% interest annually.',
      'These accounts are fully backed by the U.S. government (FDIC insurance up to $250,000), meaning your money is completely safe.',
    ],
    whyItMatters:
      'If you have $20,000 sitting in a standard checking account, you could be earning roughly $80 to $90 every single month in safe interest just by moving it into a high-yield account.',
    plainWords: [
      { word: 'FDIC Insured', meaning: 'The federal government guarantees you will not lose your money even if the bank goes out of business.' },
      { word: 'APY', meaning: 'Annual Percentage Yield — the percentage of interest you earn over a full year.' },
    ],
    readTimeMinutes: 2,
  },
  {
    id: 'story-7',
    title: 'Good News: National Parks Expand Free Lifetime Passes and Easy Accessibility Trails for Seniors',
    slug: 'good-news-national-parks-expand-free-lifetime-passes-and-easy-accessibility-trai',
    simplifiedTitle: 'National Parks Add Smoother Trails and Easy Access for Older Visitors',
    source: 'Good News Network',
    sourceUrl: 'https://goodnewsnetwork.org',
    pubDate: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6h ago
    timeAgo: '6h ago',
    category: 'good-news',
    categoryLabel: 'Good News',
    imageUrl: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=800&q=80',
    originalSummary:
      'The National Park Service announced the completion of 40 new barrier-free scenic walkways and expanded visitor center shuttles across Yellowstone, Grand Canyon, and Shenandoah, alongside popular lifetime America the Beautiful passes for seniors 62 and over.',
    bigPicture:
      'Visiting America’s national parks is getting easier, with new paved scenic walkways, benches, and shuttle buses designed for visitors with knee or back limitations.',
    whatHappened: [
      'Over 40 national parks have updated trails to be smooth, flat, and wide enough for walking sticks, walkers, and wheelchairs.',
      'Shuttle services now take visitors straight to iconic viewpoints without needing to hike long, rocky inclines.',
      'U.S. citizens aged 62 and older can get an "America the Beautiful" Senior Pass for $80, granting lifetime free admission to over 2,000 federal recreation sites.',
    ],
    whyItMatters:
      'You don’t have to climb steep mountains to enjoy nature. Take advantage of the lifetime senior pass and enjoy the country’s most breathtaking views at your own pace.',
    plainWords: [
      { word: 'Barrier-Free', meaning: 'Walkways with no steps or rough rocks, making them easy and safe to walk on.' },
      { word: 'Lifetime Pass', meaning: 'Pay once and you get free entry for the rest of your life.' },
    ],
    readTimeMinutes: 2,
  },
  {
    id: 'story-8',
    title: 'New Simple Guide to Smartphone Privacy: How to Stop Apps from Tracking You in 3 Taps',
    slug: 'new-simple-guide-to-smartphone-privacy-how-to-stop-apps-from-tracking-you-in-3-t',
    simplifiedTitle: 'How to Turn Off Annoying Phone Tracking in 3 Simple Steps',
    source: 'NPR Technology',
    sourceUrl: 'https://npr.org',
    pubDate: new Date(Date.now() - 1000 * 60 * 420).toISOString(), // 7h ago
    timeAgo: '7h ago',
    category: 'tech',
    categoryLabel: 'Tech Made Simple',
    imageUrl: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80',
    originalSummary:
      'Consumer privacy advocates publish an actionable guide illustrating how smartphone users can quickly disable cross-app location tracking and personalized ad identifiers on both iOS and Android platforms to protect personal information.',
    bigPicture:
      'You can easily stop apps from following your location and showing you creepy targeted advertisements with a few simple setting changes.',
    whatHappened: [
      'Many phone apps silently ask for permission to track your exact location and read your browsing habits to sell ads.',
      'On iPhones: Go to Settings → Privacy & Security → Tracking, and turn off "Allow Apps to Request to Track".',
      'On Android: Go to Settings → Privacy → Permission Manager → Location, and set apps to "Allow only while using app" instead of "Always".',
    ],
    whyItMatters:
      'Taking two minutes to adjust these settings preserves your phone battery and stops random advertising companies from knowing where you go.',
    plainWords: [
      { word: 'Location Tracking', meaning: 'When an app uses GPS to monitor the physical places you visit throughout the day.' },
      { word: 'Targeted Ads', meaning: 'Advertisements specifically picked for you based on things you talked about or searched.' },
    ],
    readTimeMinutes: 2,
  },
  {
    id: 'story-9',
    title: 'Bipartisan Legislation Seeks to Crack Down on Hidden "Junk Fees" on Hotels, Airlines, and Cable Bills',
    slug: 'bipartisan-legislation-seeks-to-crack-down-on-hidden-junk-fees-on-hotels-airline',
    simplifiedTitle: 'Congress Moves to Ban Sneaky "Junk Fees" on Hotel and Cable Bills',
    source: 'Associated Press',
    sourceUrl: 'https://apnews.com',
    pubDate: new Date(Date.now() - 1000 * 60 * 500).toISOString(), // 8h ago
    timeAgo: '8h ago',
    category: 'us-world',
    categoryLabel: 'US & World',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    originalSummary:
      'Federal agencies and lawmakers have introduced strict disclosure rules targeting mandatory "resort fees", ticket convenience charges, and unexpected cable bill add-ons, requiring total upfront transparent price displays.',
    bigPicture:
      'New federal rules will require companies to show the full, honest price upfront, rather than surprising you with extra fees at the checkout screen.',
    whatHappened: [
      'Have you ever booked an $89 hotel room, only to see a "$45 Resort Fee" tacked onto the bill when you arrive? Lawmakers are making that illegal.',
      'Airlines will also have to clearly state baggage fees and seat selection costs from the very first search result.',
      'Cable and internet companies will be required to display a simple "nutrition label" showing the exact monthly price, including all taxes and equipment fees.',
    ],
    whyItMatters:
      'Comparing prices for vacations, flights, and monthly bills will finally be straightforward without surprise charges popping up at the end.',
    plainWords: [
      { word: 'Junk Fees', meaning: 'Extra surprise charges added to a bill for services you did not ask for or want.' },
      { word: 'Upfront Pricing', meaning: 'Showing the true total cost at the very beginning so there are no surprises.' },
    ],
    readTimeMinutes: 2,
  },
]
