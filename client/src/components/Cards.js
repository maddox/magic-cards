import React from 'react'

import EditableCard from './EditableCard'

import '../styles/Cards.css'

class Cards extends React.Component {
  renderCards() {
    const {cards} = this.props

    if (cards.length === 0) {
      return <div className="message">There are no cards</div>
    }

    return cards.map(card => {
      return <EditableCard key={card.id} card={card} />
    })
  }

  render() {
    return <div className="Cards">{this.renderCards()}</div>
  }
}

export default Cards
