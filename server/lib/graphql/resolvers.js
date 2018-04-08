let fs = require('fs')
const cardManager = require('../CardManager')
const actionsDataPath = __dirname + '/../../../config/actions.json'

var root = {
  actions: () => {
    let actions = JSON.parse(fs.readFileSync(actionsDataPath, 'utf8'))
    return Object.keys(actions).map(key => {
      const action = actions[key]
      return {name: key, type: action.type}
    })
  },
  cards: () => {
    return cardManager.cards
  },
  card: ({id}) => {
    const card = cardManager.findCard(id)
    return card
  },
  createCard: ({input}) => {
    const card = input
    cardManager.addCard(card)
    return card
  },
  updateCard: ({id, input}) => {
    const card = cardManager.findCard(id)

    if (card) {
      cardManager.updateCard(card, input)
      return card
    } else {
      return null
    }
  },
  deleteCard: ({id}) => {
    const card = cardManager.findCard(id)

    if (card) {
      cardManager.removeCard(card)
      return card
    } else {
      return null
    }
  },
}

module.exports = root
