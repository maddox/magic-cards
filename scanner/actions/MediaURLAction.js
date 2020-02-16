var exec = require('child_process').exec
const Action = require('./Action')

class MediaURLAction extends Action {
  process() {
    const envVars = this.envVars()
    const scriptPath =
      __dirname +
      '/scripts/chromecast.py --chromecast_ip ' +
      this.config.chromecast_name +
      ' ' +
      this.card.uri
    exec(scriptPath, {env: envVars}, function(error, stdout, stderr) {
      console.log(stdout, stderr, error)
    })
  }
}

module.exports = MediaURLAction
