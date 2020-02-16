var exec = require('child_process').exec
const Action = require('./Action')

class NetflixAction extends Action {
  process() {
    const envVars = this.envVars()
    const scriptPath =
      __dirname +
      '/scripts/androidviewclient.py --type netflix --chromecast_ip ' +
      this.config.chromecast_ip +
      ' ' +
      this.card.uri
    exec(scriptPath, {env: envVars}, function(error, stdout, stderr) {
      console.log(stdout, stderr, error)
    })
  }
}

module.exports = ScriptAction
