const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const publicDir = path.join(__dirname, '..', 'public')
const iconsDir = path.join(publicDir, 'icons')

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true })
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true })

function createIconSvg(size, maskable = false) {
  const pad = maskable ? size * 0.15 : 0
  const innerSize = size - pad * 2
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#022c22"/>
        <stop offset="50%" stop-color="#065f46"/>
        <stop offset="100%" stop-color="#059669"/>
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#fbbf24"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.3"/>
      </filter>
    </defs>
    
    <rect width="${size}" height="${size}" rx="${maskable ? 0 : size * 0.22}" fill="url(#bg)"/>
    
    <!-- Outer dashed contrast ring -->
    <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.42}" fill="none" stroke="#34d399" stroke-width="${size * 0.015}" stroke-dasharray="12 6" opacity="0.4"/>
    
    <g transform="translate(${pad}, ${pad}) scale(${innerSize / 100})">
      <!-- Newspaper Sheet -->
      <rect x="22" y="20" width="56" height="62" rx="6" fill="#ffffff" filter="url(#shadow)"/>
      
      <!-- Fold corner accent -->
      <path d="M 64 20 L 78 34 L 64 34 Z" fill="#e2e8f0"/>
      
      <!-- Headline Bar -->
      <rect x="28" y="28" width="30" height="5" rx="2" fill="#059669"/>
      
      <!-- Photo box on paper -->
      <rect x="28" y="38" width="20" height="15" rx="3" fill="#e2e8f0"/>
      <circle cx="34" cy="44" r="3" fill="#059669"/>
      
      <!-- Text lines -->
      <rect x="52" y="38" width="20" height="3" rx="1.5" fill="#64748b"/>
      <rect x="52" y="44" width="18" height="3" rx="1.5" fill="#94a3b8"/>
      <rect x="52" y="50" width="16" height="3" rx="1.5" fill="#cbd5e1"/>
      
      <!-- Lower text lines -->
      <rect x="28" y="58" width="44" height="3" rx="1.5" fill="#64748b"/>
      <rect x="28" y="64" width="44" height="3" rx="1.5" fill="#94a3b8"/>
      <rect x="28" y="70" width="36" height="3" rx="1.5" fill="#cbd5e1"/>
      
      <!-- Reading Glasses Badge (Bottom Right) -->
      <g transform="translate(48, 58)" filter="url(#shadow)">
        <circle cx="10" cy="12" r="9" fill="#0f172a" stroke="url(#gold)" stroke-width="2.5"/>
        <circle cx="28" cy="12" r="9" fill="#0f172a" stroke="url(#gold)" stroke-width="2.5"/>
        <path d="M 19 12 Q 23.5 8 28 12" fill="none" stroke="url(#gold)" stroke-width="2.5"/>
      </g>
    </g>
  </svg>
  `
}

function createFeatureGraphicSvg() {
  return `
  <svg width="1024" height="500" viewBox="0 0 1024 500" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fbg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#022c22"/>
        <stop offset="40%" stop-color="#064e3b"/>
        <stop offset="100%" stop-color="#059669"/>
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#fbbf24"/>
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity="0.4"/>
      </filter>
    </defs>
    
    <!-- Background -->
    <rect width="1024" height="500" fill="url(#fbg)"/>
    
    <!-- Grid overlay pattern -->
    <g opacity="0.06" stroke="#ffffff" stroke-width="1">
      <line x1="0" y1="100" x2="1024" y2="100"/>
      <line x1="0" y1="200" x2="1024" y2="200"/>
      <line x1="0" y1="300" x2="1024" y2="300"/>
      <line x1="0" y1="400" x2="1024" y2="400"/>
      <line x1="250" y1="0" x2="250" y2="500"/>
      <line x1="500" y1="0" x2="500" y2="500"/>
      <line x1="750" y1="0" x2="750" y2="500"/>
    </g>
    
    <!-- Left Column: Branding -->
    <g transform="translate(60, 70)">
      <!-- App Icon -->
      <g filter="url(#shadow)">
        <rect width="110" height="110" rx="24" fill="#047857" stroke="#34d399" stroke-width="3"/>
        <circle cx="55" cy="55" r="32" fill="#022c22"/>
        <rect x="40" y="38" width="30" height="34" rx="4" fill="#ffffff"/>
        <rect x="44" y="44" width="22" height="4" rx="1" fill="#059669"/>
        <rect x="44" y="52" width="16" height="3" rx="1" fill="#64748b"/>
        <rect x="44" y="58" width="20" height="3" rx="1" fill="#94a3b8"/>
      </g>
      
      <text x="135" y="60" font-family="system-ui, sans-serif" font-weight="900" font-size="44" fill="#ffffff" letter-spacing="-1">
        SimplyBig<tspan fill="#34d399">News</tspan>
      </text>
      <text x="135" y="98" font-family="system-ui, sans-serif" font-weight="700" font-size="20" fill="url(#gold)" letter-spacing="1">
        FAST, SIMPLE &amp; CLEAR
      </text>
      
      <text x="0" y="180" font-family="system-ui, sans-serif" font-weight="800" font-size="34" fill="#ffffff">
        Clear, Calm &amp; Simple News Every Day
      </text>
      <text x="0" y="220" font-family="system-ui, sans-serif" font-weight="400" font-size="19" fill="#a7f3d0">
        Everyday words without media fluff. Honest &amp; comfortable to read.
      </text>
      
      <!-- Feature Pills -->
      <g transform="translate(0, 260)">
        <rect x="0" y="0" width="185" height="44" rx="22" fill="#065f46" stroke="#34d399" stroke-width="2"/>
        <text x="92" y="28" font-family="system-ui, sans-serif" font-weight="700" font-size="15" fill="#ffffff" text-anchor="middle">
          ✨ Zero Fluff
        </text>
        
        <rect x="200" y="0" width="180" height="44" rx="22" fill="#065f46" stroke="#34d399" stroke-width="2"/>
        <text x="290" y="28" font-family="system-ui, sans-serif" font-weight="700" font-size="15" fill="#ffffff" text-anchor="middle">
          🔊 Listen Aloud Audio
        </text>
        
        <rect x="395" y="0" width="180" height="44" rx="22" fill="#065f46" stroke="#34d399" stroke-width="2"/>
        <text x="485" y="28" font-family="system-ui, sans-serif" font-weight="700" font-size="15" fill="#ffffff" text-anchor="middle">
          👓 Large Readable Text
        </text>
      </g>
    </g>
    
    <!-- Right Column: Reader Card Mockup -->
    <g transform="translate(680, 50)" filter="url(#shadow)">
      <rect x="0" y="0" width="280" height="400" rx="30" fill="#fdfbf7" stroke="#34d399" stroke-width="3"/>
      <!-- Header -->
      <rect x="20" y="24" width="240" height="34" rx="10" fill="#059669"/>
      <text x="140" y="46" font-family="sans-serif" font-weight="800" font-size="13" fill="#ffffff" text-anchor="middle">
        SimplyBigNews Daily
      </text>
      <!-- Title -->
      <text x="24" y="85" font-family="sans-serif" font-weight="900" font-size="16" fill="#1c1917">
        Social Security COLA:
      </text>
      <text x="24" y="105" font-family="sans-serif" font-weight="800" font-size="15" fill="#059669">
        Checks Increase Next Month
      </text>
      <!-- Gist Box -->
      <rect x="20" y="125" width="240" height="70" rx="14" fill="#d1fae5" stroke="#10b981" stroke-width="1.5"/>
      <text x="32" y="145" font-family="sans-serif" font-weight="800" font-size="11" fill="#065f46">
        THE GIST:
      </text>
      <text x="32" y="165" font-family="sans-serif" font-weight="600" font-size="11" fill="#1c1917">
        Monthly payments will increase
      </text>
      <text x="32" y="180" font-family="sans-serif" font-weight="600" font-size="11" fill="#1c1917">
        by $50-$65 for average retirees.
      </text>
      <!-- Bullet Points -->
      <circle cx="28" cy="220" r="5" fill="#059669"/>
      <text x="40" y="224" font-family="sans-serif" font-weight="600" font-size="11" fill="#44403c">Adjusts for higher groceries &amp; fuel</text>
      <circle cx="28" cy="245" r="5" fill="#059669"/>
      <text x="40" y="249" font-family="sans-serif" font-weight="600" font-size="11" fill="#44403c">Takes effect on January 1st</text>
      <circle cx="28" cy="270" r="5" fill="#059669"/>
      <text x="40" y="274" font-family="sans-serif" font-weight="600" font-size="11" fill="#44403c">Medicare changes update soon</text>
      <!-- Listen Button CTA -->
      <rect x="20" y="315" width="240" height="42" rx="14" fill="url(#gold)"/>
      <text x="140" y="342" font-family="sans-serif" font-weight="900" font-size="14" fill="#1c1917" text-anchor="middle">
        🔊 Listen (1-Min Summary)
      </text>
    </g>
  </svg>
  `
}

async function run() {
  console.log('Generating PlainNews graphics...')

  // 1. icon-192.png
  await sharp(Buffer.from(createIconSvg(192))).png().toFile(path.join(iconsDir, 'icon-192.png'))
  console.log('Created icon-192.png')

  // 2. icon-512.png
  const svg512 = Buffer.from(createIconSvg(512))
  await sharp(svg512).png().toFile(path.join(iconsDir, 'icon-512.png'))
  console.log('Created icon-512.png')

  // 3. icon-maskable-512.png
  await sharp(Buffer.from(createIconSvg(512, true))).png().toFile(path.join(iconsDir, 'icon-maskable-512.png'))
  console.log('Created icon-maskable-512.png')

  // 4. apple-touch-icon.png
  await sharp(Buffer.from(createIconSvg(180))).png().toFile(path.join(publicDir, 'apple-touch-icon.png'))
  console.log('Created apple-touch-icon.png')

  // 5. favicon.ico
  await sharp(Buffer.from(createIconSvg(64))).png().toFile(path.join(publicDir, 'favicon.ico'))
  console.log('Created favicon.ico')

  // 6. Google Play 512x512
  await sharp(svg512).png().toFile(path.join(publicDir, 'play-icon-512.png'))
  console.log('Created play-icon-512.png')

  // 7. Google Play 1024x500 Feature Graphic
  await sharp(Buffer.from(createFeatureGraphicSvg())).png().toFile(path.join(publicDir, 'play-feature-1024x500.png'))
  console.log('Created play-feature-1024x500.png')

  console.log('All PlainNews assets generated successfully!')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
