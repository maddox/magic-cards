var exec = require('child_process').exec
const MediaURLAction = require('./MediaURLAction')

class DLNAAction extends MediaURLAction {
  process() {
    // Remove the DLNA title from this uri
    this.card.uri = this.card.uri
      .split(':')
      .slice(1)
      .join(':')
    // Run as a normal media URL
    super.process()
  }
}

module.exports = DLNAAction
