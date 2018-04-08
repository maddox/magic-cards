const fetch = require('node-fetch')
const Action = require('./Action')

class ChannelsAction extends Action {
  process() {
    let path = 'play/'

    if (this.card.type === 'channel') {
      path += 'channel'
    } else {
      path += 'recording'
    }

    path += `/${this.card.uri}`

    console.log(path)

    this.request(path)
  }

  async request(path) {
    const requestURL = `http://${this.config.host}:${this.config.port}/api/${path}`

    return fetch(requestURL, {
      method: 'POST',
    })
      .then(res => res.text())
      .then(body => console.log(body))
      .catch(error => console.log(error))
  }
}

module.exports = ChannelsAction
