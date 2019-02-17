const fetch = require('node-fetch')
const Action = require('./Action')
const https = require('https')

class HomeAssistantAction extends Action {
  process() {
    this.request(this.payload())
  }

  payload() {
    const envVars = this.envVars()
    const payload = {}

    Object.keys(envVars).forEach(key => {
      if (key.includes('HOMEASSISTANT')) {
        return
      }
      payload[key.toLowerCase()] = envVars[key]
    })

    return payload
  }

  async request(payload) {
    const protocol = this.config.ssl ? 'https://' : 'http://'
    const baseURL = `${protocol}${this.config.host}:${
      this.config.port
    }/api/events/magic_card_scanned`

    let headers = {'Content-Type': 'application/json'}
    if (this.config.token) {
      headers['Authorization'] = `Bearer ${this.config.token}`
    } else if (this.config.password) {
      headers['x-ha-access'] = this.config.password
    }

    const init = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    }

    // Compare to false so that we don't disable SSL if option omitted
    if (this.config.verify_ssl === false) {
      init.agent = new https.Agent({
        rejectUnauthorized: false,
      })
    }

    return fetch(baseURL, init)
      .then(res => res.text())
      .then(body => console.log(body))
      .catch(error => console.log(error))
  }
}

module.exports = HomeAssistantAction
