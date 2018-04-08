const InputEvent = require('input-event')
const exec = require('child_process').exec
const fs = require('fs')

const SonosAction = require('./actions/SonosAction')
const HomeAssistantAction = require('./actions/HomeAssistantAction')
const ChannelsAction = require('./actions/ChannelsAction')
const ScriptAction = require('./actions/ScriptAction')

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
  const actionData = fs.readFileSync(__dirname + '/../config/actions.json').toString()
  const actions = JSON.parse(actionData)
  let action = actions[card.action]

  if (!action) {
    console.log(`Action not found: ${card.action}`)
    return
  }

  console.log(`Processing action: ${card.action}`)

  let actionProcessor

  if (action.type === 'sonos') {
    actionProcessor = new SonosAction(card, action)
  } else if (action.type === 'home_assistant') {
    actionProcessor = new HomeAssistantAction(card, action)
  } else if (action.type === 'channels') {
    actionProcessor = new ChannelsAction(card, action)
  } else if (action.type === 'script') {
    actionProcessor = new ScriptAction(card, action)
  }

  if (actionProcessor) {
    actionProcessor.process()
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
