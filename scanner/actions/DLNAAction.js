var exec = require('child_process').exec
const MediaURLAction = require('./MediaURLAction')
const pythonExtensionsPath =
  __dirname + '/../../.virtualenv/bin/python ' + __dirname + '/../../python_extensions'

class DLNAAction extends MediaURLAction {
  process() {
    const envVars = this.envVars()
    // Stop playback here for better UX
    const scriptPathCC =
      pythonExtensionsPath + '/chromecast.py --chromecast_ip ' + this.config.chromecast_ip + ' stop'
    exec(scriptPathCC, {env: envVars}, function(error, stdout, stderr) {
      console.log(stdout, stderr, error)
    })
    // Fetch all DLNA titles, and use the mappings to get a media URL
    const scriptPathDLNA =
      pythonExtensionsPath + '/dlna.py --dlnaserver_ip ' + this.config.dlnaserver_ip
    exec(scriptPathDLNA, (error, stdout, stderr) => {
      if (error || stderr) {
        console.log(error)
      } else {
        const dlnaMappings = JSON.parse(stdout)
        const random = this.card.uri.split(':')[0]
        const regex = this.card.uri.split(':')[1]
        console.log('regex', regex)
        // Allow using regex for getting multiple urls
        this.card.uri =
          random +
          (random != '' ? ':' : '') +
          Object.entries(dlnaMappings)
            .filter(val => val[0].match(regex) !== null)
            .map(val => val[1])
            .join(' ')
        // Run as a normal media URL
        super.process()
      }
    })
  }
}

module.exports = DLNAAction
