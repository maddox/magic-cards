const exec = require('child_process').exec
const express = require('express')
const path = require('path')
const ejs = require('ejs')
const SpotifyWebApi = require('spotify-web-api-node')
const axios = require('axios')
const cheerio = require('cheerio')

const config = require(__dirname + '/../config/config.json')
const dlnaPath = __dirname + '/../.virtualenv/bin/python ' + __dirname + '/../scanner/utils/dlna.py'
const scannerPath = __dirname + '/../.virtualenv/bin/python ' + __dirname + '/../scanner/scanner.py'

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

app.get('/card/:id', (req, res) => {
  const card = findCard(req.params.id)
  ejs.renderFile('card.ejs', card, {}, (err, str) => {
    res.send(str)
  })
})

app.post('/test/:code', (req, res) => {
  const command = `${scannerPath} --code ${req.params.code}`
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

const parseWebpage = async (url, res, parser) => {
  const responder = data => {
    console.log(data)
    res.send(data)
  }
  const errorHandler = error => {
    console.error(error)
    res.send({message: 'error'})
  }

  return axios
    .get(url)
    .then(result => cheerio.load(result.data))
    .then(parser)
    .then(responder)
    .catch(errorHandler)
}

app.get('/metadata/netflix', (req, res) => {
  const url = req.query.url
  parseWebpage(url, res, $ => {
    return {
      hero_image_url: $('.hero-image')
        .attr('style')
        .match(/background-image: ?url\("(.*)\"/)[1],
      title: $('.title-title').text(),
      year: $('.title-info-metadata-item.item-year').text(),
    }
  })
})

app.get('/metadata/yleareena', (req, res) => {
  const url = req.query.url
  parseWebpage(url, res, $ => {
    return {
      cover_image: $('.cover-image .holder')
        .attr('style')
        .match(/background-image: ?url\('(.*)'/)[1],
      title: $('.cover-image h1').text(),
    }
  })
})

app.get('/metadata/youtube', (req, res) => {
  const url = req.query.url
  parseWebpage(url, res, $ => {
    return {
      image: $('head > meta[property="og:image"]').attr('content'),
      title: $('head > meta[property="og:title"]').attr('content'),
    }
  })
})

app.get('/dlna-media', (req, res) => {
  const scriptPath = dlnaPath + ' --dlnaserver_ip ' + config.dlnaserver_ip
  console.log(`Running ${scriptPath}`)
  exec(scriptPath, function(error, stdout, stderr) {
    if (error || stderr) {
      console.log(error)
      res.send('error')
    } else {
      res.send(JSON.parse(stdout))
    }
  })
})

app.listen(port, () => console.log(`Listening on port ${port}`))
