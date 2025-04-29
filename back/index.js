// import express from 'express'
// import Parser from 'rss-parser'
// import cors from 'cors'

// const app = express()
// const parser = new Parser()

// app.use(cors())

// app.get('*', (req,res) => {
//     res.sendFile()
//     res.send('veille informationnelle')
// })

// app.get('/rss', async (req,res) => {
//     try {
//         let feed = await parser.parseURL('https://feeds.feedburner.com/Grafikart');
//         res.json(feed)
//       } catch (e) {
//         res.status(500).json({ error: 'Erreur lors du parsing RSS' })
//       }
// })

// app.listen(3000, () => {
//     console.log(`l'application écoute sur le port 3000`)
// })


import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import Parser from 'rss-parser'
import cors from 'cors'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const parser = new Parser()

app.use(cors())

// Servez les fichiers statiques du frontend (build Vite)
app.use(express.static(path.join(__dirname, 'dist')))

app.get('/feed', (req,res) => {
    res.status(404).send(`Le flux n'est pas encore disponible, patience.`)
})

// API RSS accessible à /feed
app.get('/api/feed', async (req, res) => {
  try {
    const feed = await parser.parseURL('https://feeds.feedburner.com/Grafikart')
    res.json(feed)
  } catch (e) {
    res.status(500).json({ error: 'Erreur lors du parsing RSS' })
  }
})

// Pour toute autre route, on renvoie index.html (support du routing côté front)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'))
// })

// Lancement du serveur
app.listen(3000, () => {
  console.log('Application disponible sur http://localhost:3000')
})
