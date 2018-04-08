var exec = require('child_process').exec
const Action = require('./Action')

class ScriptAction extends Action {
  process() {
    const envVars = this.envVars()
    const scriptPath = __dirname + '/../../config/' + this.config.filename
    exec(scriptPath, {env: envVars}, function(error, stdout, stderr) {
      console.log(stdout, stderr, error)
    })
  }
}

module.exports = ScriptAction
