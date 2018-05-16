const fetch = require('node-fetch')
const base64 = require('base-64')
const Action = require('./Action')

class SonosAction extends Action {
  process() {
    const contentConfig = this.config[this.card.type] || {}

    const request = async () => {
      await this.setRepeat(contentConfig.repeat)
      await this.forcePlaylistPlayback()
      await this.clearQueue()
      await this.setShuffle(contentConfig.shuffle)

      setTimeout(() => {
        this.roomRequest(this.card.uri)
      }, 200)
    }

    request()
  }

  async setShuffle(mode) {
    if (!mode) {
      return
    }

    return this.shuffle(mode)
  }

  async setRepeat(mode) {
    if (!mode) {
      return
    }

    return this.repeat(mode)
  }

  async clearQueue() {
    return this.roomRequest('clearqueue')
  }

  async play() {
    return this.roomRequest('play')
  }

  async shuffle(mode) {
    return this.roomRequest(`shuffle/${mode}`)
  }

  async repeat(mode) {
    return this.roomRequest(`repeat/${mode}`)
  }

  async forcePlaylistPlayback() {
    const room = this.config.room
    const zones = await this.request('zones')
    const zone = zones.find(zone => zone.coordinator.roomName === room)
    return this.roomRequest(`SetAVTransportURI/x-rincon-queue:${zone.uuid}%230`)
  }

  async roomRequest(path) {
    const room = encodeURIComponent(this.config.room)
    this.request(`${room}/${path}`)
  }

  async request(path) {
    const baseURL = `http://${this.config.host}:${this.config.port}/${path}`

    console.log(`Calling: ${baseURL}`)

    let headers = {}
    if (this.config.username && this.config.password) {
      headers['Authorization'] =
        'Basic ' + base64.encode(this.config.username + ':' + this.config.password)
    }

    return fetch(baseURL, {
      method: 'GET',
      headers: headers,
    })
      .then(res => res.json())
      .catch(error => console.log(error))
  }
}

module.exports = SonosAction
