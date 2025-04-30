import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import Parser from 'rss-parser'
import cors from 'cors'
import RSS from 'rss'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const parser = new Parser()

app.use(cors())

// Servez les fichiers statiques du frontend (build Vite)
app.use(express.static(path.join(__dirname, 'dist')))


// https://www.automobile-magazine.fr/rss
const feeds = [
  { link: 'https://feeds.feedburner.com/Grafikart', tag: 'programmation' },
  { link: 'https://feeds.feedburner.com/symfony/blog', tag: 'programmation' },
  { link: 'https://stitcher.io/rss', tag: 'programmation' },
  { link: 'https://www.automobile-magazine.fr/toute-l-actualite/rss.xml', tag: 'automobile' },
  { link: 'https://www.automobile-magazine.fr/infos-pratiques/rss.xml', tag: 'automobile' },
  // { link: 'https://www.auto-moto.com/rss/index.html', tag: 'automobile' },
  // { link: 'https://fr.motorsport.com/rss/all/news/', tag: 'automobile' },
  // { link: 'https://blogautomobile.fr/feed', tag: 'automobile' },
  // { link: 'https://www.automobile-magazine.fr/rss.xml', tag: 'automobile' },
  // { link: 'https://www.turbo.fr/dossiers.xml', tag: 'automobile' },
  // { link: 'https://www.turbo.fr/global.xml', tag: 'automobile' },
  // { link: 'https://fr.motor1.com/rss/articles/all/', tag: 'automobile' },

]

app.get('/rss', async (req, res) => {
  try {
    const feed = new RSS({
      title: 'Flux combiné – Nolann',
      description: 'Veille sur Symfony, PHP et automobile',
      feed_url: 'https://nolannparcheminer.fr/rss',
      site_url: 'https://nolannparcheminer.fr',
      language: 'fr',
      pubDate: new Date()
    })

    const allItems = []

    for (const { tag, link } of feeds) {
      try {
        const parsed = await parser.parseURL(link)
        parsed.items.forEach(item => {
          allItems.push({
            title: `[${tag}] ${item.title}`,
            description: item.contentSnippet || item.content || '',
            url: item.link,
            date: item.pubDate || item.isoDate || new Date(),
            categories: [tag],
          })
        })
      } catch (err) {
        console.warn(`⚠️ Flux inaccessible : ${link} (${err.message})`)
      }
    }

    // Tri des items par date (plus récents d’abord)
    allItems.sort((a, b) => new Date(b.date) - new Date(a.date))

    // On ne garde que les 20 derniers articles
    allItems.slice(0, 20).forEach(item => {
      feed.item(item)
    })

    res.set('Content-Type', 'application/rss+xml')
    res.send(feed.xml({ indent: true }))
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création du flux', message: err.message })
  }
})

// API RSS accessible à /feed
app.get('/api/feed', async (req, res) => {
  try {
    const results = []

    for (const { link, tag } of feeds) {
      try {
        const feed = await parser.parseURL(link)
        // results.push({ tag, title: feed.title, items: feed.items.slice(0, 5) }) // on prend les 5 derniers
        for (const item of feed.items) {
          results.push({
            feedTitle: feed.title,
            feedLink: feed.link,
            tag: tag,
            ...item
          })
        }
      } catch (e) {
        console.warn(`Erreur de récupération du flux ${link}: ${e.message}`)
      }
    }

    res.json(results)
  } catch (e) {
    res.status(500).json({ error: 'Erreur lors du parsing RSS', details: e.message })
  }
})

// Pour toute autre route, on renvoie index.html (support du routing côté front)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'))
// })

// Lancement du serveur
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Application disponible sur http://localhost:${PORT}`)
})
