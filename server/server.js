const express = require('express')
const path = require('path')
const ejs = require('ejs')
const pdf = require('html-pdf')

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

app.get('/card/:id/pdf', (req, res) => {
  const card = findCard(req.params.id)
  ejs.renderFile('card.ejs', card, {}, (err, str) => {
    let options = {format: 'Letter'}

    pdf.create(str, options).toStream((err, stream) => {
      if (err) return console.log(err)
      stream.pipe(res)
    })
  })
})

app.listen(port, () => console.log(`Listening on port ${port}`))
