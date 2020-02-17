var exec = require('child_process').exec
const Action = require('./Action')
const pythonExtensionsPath =
  __dirname + '/../../.virtualenv/bin/python ' + __dirname + '/../../python_extensions'

class YoutubeAction extends Action {
  process() {
    const envVars = this.envVars()
    const scriptPath =
      pythonExtensionsPath +
      '/chromecast.py --app youtube --chromecast_ip ' +
      this.config.chromecast_ip +
      ' ' +
      this.card.uri
    exec(scriptPath, {env: envVars}, function(error, stdout, stderr) {
      console.log(stdout, stderr, error)
    })
  }
}

module.exports = YoutubeAction
