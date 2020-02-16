var exec = require('child_process').exec
const MediaURLAction = require('./MediaURLAction')
const pythonExtensionsPath = __dirname + '/../../python_extensions'

class DLNAAction extends MediaURLAction {
  process() {
    const envVars = this.envVars()
    // Stop playback here for better UX
    const scriptPath =
      pythonExtensionsPath +
      '/chromecast.py --chromecast_ip ' +
      this.config.chromecast_name +
      ' stop'
    exec(scriptPath, {env: envVars}, function(error, stdout, stderr) {
      console.log(stdout, stderr, error)
    })
    // Fetch all DLNA titles, and use the mappings to get a media URL
    const scriptPath = pythonExtensionsPath + '/dlna.py --dlnaserver_ip ' + config.dlnaserver_ip
    exec(scriptPath, (error, stdout, stderr) => {
      if (error || stderr) {
        console.log(error)
      } else {
        const dlnaMappings = JSON.parse(stdout)
        this.card.uri = dlnaMappings[this.card.uri]
        // Run as a normal media URL
        super.process()
      }
    })
  }
}

module.exports = DLNAAction
