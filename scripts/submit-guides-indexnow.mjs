import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

const KEY = 'f7b3a192c8104ebfae9231dbfe862d14'
const HOST = 'plainnews.vercel.app'

async function run() {
  const guidesDir = path.join(ROOT, 'data', 'evergreen-guides')
  if (!fs.existsSync(guidesDir)) {
    console.error('No guides directory found!')
    return
  }

  const files = fs.readdirSync(guidesDir).filter((f) => f.endsWith('.json'))
  const slugs = files.map((f) => f.replace('.json', ''))

  console.log(`Found ${slugs.length} evergreen guides to submit to IndexNow.`)

  const urls = [
    `https://${HOST}/sitemap.xml`,
    `https://${HOST}/robots.txt`,
    `https://${HOST}/guides`,
    ...slugs.map((s) => `https://${HOST}/guides/${s}`),
  ]

  console.log(`Total URLs to submit: ${urls.length}`)

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls,
  }

  try {
    const res = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    })
    console.log(`  ➔ Response HTTP ${res.status} (${res.statusText || 'OK'})`)
  } catch (err) {
    console.error('  ➔ Request failed:', err.message)
  }
}

run()
