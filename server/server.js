const express = require('express')
const path = require('path')
const ejs = require('ejs')

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

app.listen(port, () => console.log(`Listening on port ${port}`))
