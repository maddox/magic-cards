const globalConfig = require(__dirname + '/../../config/config.json')

class Action {
  constructor(card, config) {
    delete config.action

    this.card = card
    this.config = config
  }

  envVarsForObject(config, prefix) {
    const envVars = {}

    delete config.action
    delete config.id

    Object.keys(config).forEach(key => {
      const value = config[key]

      if (!!value && typeof value === 'object') {
        const nestedEnvVars = this.envVarsForObject(value, `${prefix}_${key.toUpperCase()}`)
        Object.assign(envVars, nestedEnvVars)
      } else {
        envVars[`${prefix}_${key.toUpperCase()}`] = value
      }
    })

    return envVars
  }

  envVars() {
    let envVars = this.envVarsForObject(this.card, 'CARD')
    envVars = Object.assign(envVars, {magic_cards_room: globalConfig.room})

    const prefix = this.constructor.name.replace('Action', '').toUpperCase()
    return Object.assign(envVars, this.envVarsForObject(this.config, prefix))
  }
}

module.exports = Action
