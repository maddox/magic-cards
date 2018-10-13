const exec = require('child_process').exec
const express = require('express')
const path = require('path')
const ejs = require('ejs')
const fs = require('fs')
const SpotifyWebApi = require('spotify-web-api-node')

const config = require(__dirname + '/../config/config.json')

// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
  clientId: config.spotify.clientID,
  clientSecret: config.spotify.clientSecret,
})

const graphQLAPI = require('./lib/graphql')

const app = express()
const port = process.env.PORT || 5000

app.use('/graphql', graphQLAPI)
app.use(express.static(path.join(__dirname, 'public')))

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  })
}

app.get('/', (req, res) => {
  res.sendfile('index.html')
})

app.get('/cards', (req, res) => {
  this.cardDataPath = __dirname + '/../config/cards.json'
  if (fs.existsSync(this.cardDataPath)) {
    var cards = JSON.parse(fs.readFileSync(this.cardDataPath, 'utf8'))
    res.send(cards)
  } else {
    res.send("No cards found")
  }
})

app.get('/card/:id', (req, res) => {
  const card = findCard(req.params.id)
  ejs.renderFile('card.ejs', card, {}, (err, str) => {
    res.send(str)
  })
})

app.post('/test/:code', (req, res) => {
  const command = `node ${__dirname}/../scanner/testCard.js ${req.params.code}`
  exec(command, function(error, stdout, stderr) {
    console.log(stdout, stderr, error)
  })

  res.send('ok')
})

app.get('/metadata/spotify', (req, res) => {
  const type = req.query.type
  const uri = req.query.uri
  const user = req.query.user

  const responder = data => {
    console.log(data)
    res.send(data.body)
  }
  const errorHandler = error => {
    console.error(error)
    res.send({message: 'error'})
  }

  spotifyApi
    .clientCredentialsGrant()
    .then(data => {
      spotifyApi.setAccessToken(data.body.access_token)

      switch (type) {
        case 'album':
          spotifyApi
            .getAlbum(uri)
            .then(responder)
            .catch(errorHandler)
          break
        case 'track':
          spotifyApi
            .getTrack(uri)
            .then(responder)
            .catch(errorHandler)
          break
        case 'playlist':
          spotifyApi
            .getPlaylist(user, uri)
            .then(responder)
            .catch(errorHandler)
          break
        default:
      }
    })
    .catch(error => {
      console.log('Something went wrong when retrieving an access token', error)
      res.send('error')
    })
})

app.listen(port, () => console.log(`Listening on port ${port}`))
