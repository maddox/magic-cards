const InputEvent = require('input-event')
const cardProcessor = require('./CardProcessor')

const keys = 'X^1234567890XXXXqwertzuiopXXXXasdfghjklXXXXXyxcvbnmXXXXXXXXXXXXXXXXXXXXXXX'
const input = new InputEvent('/dev/input/event0')
const keyboard = new InputEvent.Keyboard(input)

let string = ''

keyboard.on('keyup', function(event) {
  // Enter key
  if (event.code == 28) {
    console.log(`Read Card ID: ${string}`)

    //process code
    cardProcessor.process(string)

    // reset string for next scan
    string = ''
  } else {
    string += keys[event.code]
  }
})
