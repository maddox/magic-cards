let fs = require('fs')

class CardManager {
  constructor() {
    this.cardDataPath = __dirname + '/../../config/cards.json'
    this.cards = []
    this.loadCards()
  }

  loadCards() {
    if (fs.existsSync(this.cardDataPath)) {
      this.cards = JSON.parse(fs.readFileSync(this.cardDataPath, 'utf8'))
    } else {
      this.saveCards()
    }
  }

  saveCards() {
    fs.writeFileSync(this.cardDataPath, JSON.stringify(this.cards, null, '  '), 'utf8')
  }

  findCard(id) {
    let card = this.cards.find(x => x.id == id)
    return card
  }

  findCardByCode(code) {
    let card = this.cards.find(x => x.code === code)
    return card
  }

  addCard(card) {
    card.id = Math.floor(Date.now() / 1000)
    this.cards.push(card)
    this.saveCards()
  }

  updateCard(card, newCardData) {
    Object.assign(card, newCardData)
    this.saveCards()
  }

  removeCard(card) {
    const index = this.cards.indexOf(card)
    this.cards.splice(index, 1)
    this.saveCards()
  }
}

let cardManager = new CardManager()

module.exports = cardManager
