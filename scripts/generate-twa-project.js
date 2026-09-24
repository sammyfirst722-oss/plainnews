const path = require('path')
const fs = require('fs')
const http = require('http')
const sharp = require('sharp')

// Require bubblewrap core from npx cache
const core = require('C:/Users/sammy/AppData/Local/npm-cache/_npx/881cef4662d2c421/node_modules/@bubblewrap/core')

const targetDir = 'C:/Users/sammy/plainnews-twa'
const templateDir = 'C:/Users/sammy/AppData/Local/npm-cache/_npx/881cef4662d2c421/node_modules/@bubblewrap/core/template_project'

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true })
}

const PORT = 8089

// Lightweight local server to serve icons to Bubblewrap
function startLocalServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const parsedUrl = new URL(req.url, `http://localhost:${PORT}`)
      const filePath = path.join('C:/Users/sammy/plainnews/public', parsedUrl.pathname)
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath)
        const contentType = ext === '.json' ? 'application/json' : 'image/png'
        res.writeHead(200, { 'Content-Type': contentType })
        fs.createReadStream(filePath).pipe(res)
      } else {
        res.writeHead(404)
        res.end('Not found')
      }
    })
    server.listen(PORT, () => {
      console.log(`Local static server running at http://localhost:${PORT}`)
      resolve(server)
    })
  })
}

const twaManifestData = {
  packageId: 'app.vercel.plainnews.twa',
  host: 'plainnews.vercel.app',
  name: 'PlainNews - Simple Daily News',
  launcherName: 'PlainNews',
  display: 'standalone',
  themeColor: '#065f46',
  themeColorDark: '#064e3b',
  navigationColor: '#065f46',
  navigationColorDark: '#064e3b',
  navigationDividerColor: '#00000000',
  navigationDividerColorDark: '#00000000',
  backgroundColor: '#064e3b',
  enableNotifications: false,
  startUrl: '/',
  iconUrl: `http://localhost:${PORT}/icons/icon-512.png`,
  maskableIconUrl: `http://localhost:${PORT}/icons/icon-maskable-512.png`,
  splashScreenFadeOutDuration: 300,
  signingKey: {
    path: 'C:/Users/sammy/plainnews/plainnews.keystore',
    alias: 'plainnews-key',
  },
  appVersionCode: 1,
  appVersionName: '1.0.0',
  shortcuts: [],
  generatorApp: 'bubblewrap-cli',
  webManifestUrl: `http://localhost:${PORT}/manifest.json`,
  fallbackType: 'customtabs',
  features: {},
  alphaDependencies: {
    enabled: false,
  },
  enableSiteSettingsShortcut: true,
  isChromeOSOnly: false,
  isMetaQuest: false,
  minSdkVersion: 21,
  orientation: 'portrait',
  fingerprints: [
    {
      value: 'D9:D4:E2:E4:4D:A1:03:05:F5:79:69:56:B5:42:E6:9E:08:5E:90:79:17:DD:6F:21:7D:A6:EA:8C:45:A5:62:3D',
    },
  ],
  additionalTrustedOrigins: [],
  retainedBundles: [],
}

async function generateDrawablesAndMipmaps(resDir) {
  const icon512Path = 'C:/Users/sammy/plainnews/public/icons/icon-512.png'
  const maskable512Path = 'C:/Users/sammy/plainnews/public/icons/icon-maskable-512.png'

  const mipmapDensities = [
    { dir: 'mipmap-mdpi', size: 48 },
    { dir: 'mipmap-hdpi', size: 72 },
    { dir: 'mipmap-xhdpi', size: 96 },
    { dir: 'mipmap-xxhdpi', size: 144 },
    { dir: 'mipmap-xxxhdpi', size: 192 },
  ]

  for (const m of mipmapDensities) {
    const d = path.join(resDir, m.dir)
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true })
    await sharp(icon512Path).resize(m.size, m.size).toFile(path.join(d, 'ic_launcher.png'))
    await sharp(maskable512Path).resize(m.size, m.size).toFile(path.join(d, 'ic_maskable.png'))
  }

  // Generate splash images
  const splashDensities = [
    { dir: 'drawable', w: 480, h: 800 },
    { dir: 'drawable-mdpi', w: 320, h: 480 },
    { dir: 'drawable-hdpi', w: 480, h: 800 },
    { dir: 'drawable-xhdpi', w: 720, h: 1280 },
    { dir: 'drawable-xxhdpi', w: 960, h: 1600 },
    { dir: 'drawable-xxxhdpi', w: 1280, h: 1920 },
  ]

  for (const s of splashDensities) {
    const d = path.join(resDir, s.dir)
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true })
    const iconSize = Math.round(Math.min(s.w, s.h) * 0.45)
    const resizedIcon = await sharp(icon512Path).resize(iconSize, iconSize).toBuffer()

    await sharp({
      create: {
        width: s.w,
        height: s.h,
        channels: 4,
        background: { r: 6, g: 78, b: 59, alpha: 1 }
      }
    })
    .composite([{ input: resizedIcon, gravity: 'center' }])
    .png()
    .toFile(path.join(d, 'splash.png'))
  }

  // Copy store_icon.png (512x512) to targetDir
  await sharp(icon512Path).resize(512, 512).toFile(path.join(targetDir, 'store_icon.png'))
  console.log('Saved store_icon.png and drawables to', targetDir)
}

async function main() {
  const server = await startLocalServer()

  try {
    console.log('Instantiating TwaManifest...')
    const twaManifest = new core.TwaManifest(twaManifestData)
    
    // Save twa-manifest.json in targetDir
    fs.writeFileSync(
      path.join(targetDir, 'twa-manifest.json'),
      JSON.stringify(twaManifest.toJson(), null, 2),
      'utf-8'
    )
    console.log('Saved twa-manifest.json to', targetDir)

    console.log('Creating TWA Project via TwaGenerator...')
    const generator = new core.TwaGenerator()
    await generator.createTwaProject(targetDir, twaManifest, templateDir)
    console.log('TWA Project created successfully in', targetDir)

    // Configure app/build.gradle with signing config and SDK 36
    const appBuildGradlePath = path.join(targetDir, 'app', 'build.gradle')
    if (fs.existsSync(appBuildGradlePath)) {
      let gradleContent = fs.readFileSync(appBuildGradlePath, 'utf-8')
      
      const signingConfig = `    signingConfigs {
        release {
            storeFile file("C:/Users/sammy/plainnews/plainnews.keystore")
            storePassword "PlainNews2026Secure!"
            keyAlias "plainnews-key"
            keyPassword "PlainNews2026Secure!"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
        }
    }`

      if (gradleContent.includes('buildTypes {')) {
        gradleContent = gradleContent.replace(/buildTypes\s*\{[\s\S]*?\}/, signingConfig)
      } else {
        gradleContent = gradleContent.replace('android {', `android {\n${signingConfig}`)
      }

      gradleContent = gradleContent.replace(/compileSdkVersion\s+\d+/, 'compileSdkVersion 36')
      gradleContent = gradleContent.replace(/targetSdkVersion\s+\d+/, 'targetSdkVersion 36')

      fs.writeFileSync(appBuildGradlePath, gradleContent, 'utf-8')
      console.log('Updated app/build.gradle with release signing config and SDK 36')
    }

    // Generate drawables and mipmaps
    const resDir = path.join(targetDir, 'app', 'src', 'main', 'res')
    await generateDrawablesAndMipmaps(resDir)

    console.log('PlainNews TWA Project is completely ready!')
  } finally {
    server.close()
  }
}

main().catch((err) => {
  console.error('Error generating TWA project:', err)
  process.exit(1)
})
