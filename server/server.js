const exec = require('child_process').exec
const express = require('express')
const path = require('path')
const ejs = require('ejs')
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

app.get('/', (req, res) => {
  res.sendfile('index.html')
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

app.listen(port, () => console.log(`Listening on port ${port}`))
