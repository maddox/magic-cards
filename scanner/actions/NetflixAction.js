var exec = require('child_process').exec
const Action = require('./Action')
const pythonExtensionsPath =
  __dirname + '/../../.virtualenv/bin/python ' + __dirname + '/../../python_extensions'

class NetflixAction extends Action {
  process() {
    const envVars = this.envVars()
    const connectIP = this.config.adb_connect
      ? ' --connect_ip ' + this.config.adb_connect + ' '
      : ''
    const scriptPath =
      pythonExtensionsPath +
      '/chromecast.py --app netflix --chromecast_ip ' +
      this.config.chromecast_ip +
      ' ' +
      connectIP +
      this.card.uri
    exec(scriptPath, {env: envVars}, function(error, stdout, stderr) {
      console.log(stdout, stderr, error)
    })
  }
}

module.exports = NetflixAction
