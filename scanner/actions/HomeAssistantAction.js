const fetch = require('node-fetch')
const base64 = require('base-64')
const Action = require('./Action')

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
    if (this.config.password) {
      headers['x-ha-access'] = this.config.password
    }

    return fetch(baseURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    })
      .then(res => res.text())
      .then(body => console.log(body))
      .catch(error => console.log(error))
  }
}

module.exports = HomeAssistantAction
