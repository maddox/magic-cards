const cardProcessor = require('./CardProcessor')

var args = process.argv.slice(2)

cardProcessor.process(args[0])
