const fs = require('fs')
const path = require('path')

const dir = path.join(process.cwd(), 'public', 'brands')
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

function saveBrand(filename, content) {
  fs.writeFileSync(path.join(dir, filename), content.trim(), 'utf8')
  console.log('Saved:', filename)
}

async function main() {
  // 1. Google 4-color
  const googleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
</svg>`
  saveBrand('google.svg', googleSvg)

  // 2. Google Gemini Official 4-color Spark
  const geminiSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
  <defs>
    <linearGradient id="gemini-g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4285F4" />
      <stop offset="35%" stop-color="#9B72CF" />
      <stop offset="70%" stop-color="#D96570" />
      <stop offset="100%" stop-color="#F4B400" />
    </linearGradient>
  </defs>
  <path fill="url(#gemini-g1)" d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12Z"/>
</svg>`
  saveBrand('gemini.svg', geminiSvg)

  // 3. ChatGPT / OpenAI (Classic emerald square with white spiral)
  const chatgptSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
  <rect width="24" height="24" rx="5" fill="#10A37F"/>
  <g fill="#FFFFFF" transform="scale(0.68) translate(5.6, 5.6)">
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.677l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0L4.14 13.75a4.5 4.5 0 0 1-1.8-5.855zm16.597 3.855-5.843-3.369 2.02-1.168a.076.076 0 0 1 .071 0l4.679 2.701a4.5 4.5 0 0 1-.676 8.123v-5.678a.79.79 0 0 0-.251-.609zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.679-2.701a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
  </g>
</svg>`
  saveBrand('chatgpt.svg', chatgptSvg)

  // 4. Netflix (Official Iconic Red N)
  const netflixSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
  <rect width="24" height="24" rx="5" fill="#141414"/>
  <g transform="scale(0.7) translate(5.2, 5.2)">
    <path fill="#B81D24" d="M4 0h4.5v24H4z"/>
    <path fill="#B81D24" d="M15.5 0H20v24h-4.5z"/>
    <path fill="#E50914" d="M4 0h4.6l7.4 19.5V24h-4.6L4 4.5z"/>
  </g>
</svg>`
  saveBrand('netflix.svg', netflixSvg)

  // 5. YouTube (Official Red Button)
  const youtubeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
  <rect width="24" height="24" rx="5" fill="#FF0000"/>
  <path fill="#FFFFFF" d="M10 8l6 4-6 4V8z"/>
</svg>`
  saveBrand('youtube.svg', youtubeSvg)

  // 6. Spotify (Official Green Soundwaves)
  const spotifySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
  <circle cx="12" cy="12" r="12" fill="#1ED760"/>
  <path fill="#000000" d="M17.9 10.9C14.3 8.8 8.3 8.6 4.9 9.7c-.5.2-1.1-.1-1.3-.6-.2-.5.1-1.1.6-1.3 4-1.2 10.6-1 14.8 1.5.5.3.6.9.3 1.4-.2.5-.8.6-1.4.3zm-.1 2.9c-.3.4-.8.5-1.2.3-3-1.8-7.5-2.3-11-1.3-.4.1-.9-.1-1-.6-.1-.4.1-.9.6-1 4.1-1.2 9.1-.6 12.5 1.4.4.2.5.8.1 1.2zm-1.4 2.8c-.2.3-.6.4-1 .2-2.6-1.6-5.9-2-9.7-1.1-.4.1-.7-.2-.8-.5-.1-.4.2-.7.5-.8 4.2-1 7.9-.5 10.8 1.3.4.2.4.6.2.9z"/>
</svg>`
  saveBrand('spotify.svg', spotifySvg)

  // 7. Canva (Official Gradient Circle with Elegant Script C)
  try {
    const canvaRes = await fetch('https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/canva.svg')
    if (canvaRes.ok) {
      const raw = await canvaRes.text()
      const match = raw.match(/<path[^>]+>/)
      if (match) {
        const canvaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
  <defs>
    <linearGradient id="canva-grad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00C4CC"/>
      <stop offset="60%" stop-color="#7D2AE8"/>
    </linearGradient>
  </defs>
  <rect width="24" height="24" rx="5" fill="url(#canva-grad)"/>
  <g fill="#FFFFFF" transform="scale(0.68) translate(5.6, 5.6)">
    ${match[0]}
  </g>
</svg>`
        saveBrand('canva.svg', canvaSvg)
      }
    }
  } catch (e) {
    console.log('Canva fetch error:', e.message)
  }

  // 8. CapCut (Official bowtie logo on dark background)
  try {
    const capcutRes = await fetch('https://commons.wikimedia.org/wiki/Special:FilePath/Capcut-icon.svg', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    if (capcutRes.ok) {
      const raw = await capcutRes.text()
      // Clean and ensure viewBox
      saveBrand('capcut.svg', raw)
    }
  } catch (e) {
    console.log('CapCut fetch error:', e.message)
  }
}

main()
