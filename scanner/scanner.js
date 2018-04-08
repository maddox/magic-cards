const InputEvent = require('input-event')
const exec = require('child_process').exec
const fs = require('fs')

const SonosAction = require('./actions/SonosAction')
const HomeAssistantAction = require('./actions/HomeAssistantAction')
const ScriptAction = require('./actions/ScriptAction')

const actions = require(__dirname + '/../config/actions.json')

const keys = 'X^1234567890XXXXqwertzuiopXXXXasdfghjklXXXXXyxcvbnmXXXXXXXXXXXXXXXXXXXXXXX'
const input = new InputEvent('/dev/input/event0')

const keyboard = new InputEvent.Keyboard(input)

function findCard(code) {
  const data = fs.readFileSync(__dirname + '/../config/cards.json').toString()
  const cards = JSON.parse(data)

  const card = cards.find(c => c.code === code)
  return card
}

function processCard(card) {
  let action = actions[card.action]

  if (!action) {
    console.log(`Action not found: ${card.action}`)
    return
  }

  console.log(`Processing action: ${card.action}`)

  if (action.type === 'sonos') {
    const sonos = new SonosAction(card, action)
    sonos.process()
  } else if (action.type === 'home_assistant') {
    const hass = new HomeAssistantAction(card, action)
    hass.process()
  } else if (action.type === 'script') {
    const script = new ScriptAction(card, action)
    script.process()
  }
}

let string = ''

keyboard.on('keyup', function(event) {
  // Enter key
  if (event.code == 28) {
    console.log(`Read Card ID: ${string}`)
    console.log('Finding card...')
    let card = findCard(string)

    // reset string for next scan
    string = ''

    if (!card) {
      console.log('Card not found.')
      return
    }

    console.log(`Found card: ${card.title}. Processing...`)
    processCard(card)
  } else {
    string += keys[event.code]
  }
})
