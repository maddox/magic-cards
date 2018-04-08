import React from 'react'
import validUrl from 'valid-url'
import {Icon} from 'semantic-ui-react'

import '../styles/Card.css'

class Card extends React.Component {
  render() {
    const {card, handleLeftBadgeClick, handleRightBadgeClick} = this.props
    let leftBadge, rightBadge

    if (handleLeftBadgeClick) {
      leftBadge = (
        <div className="badge left" onClick={handleLeftBadgeClick} title="Test card">
          <Icon name="play circle" />
        </div>
      )
    }

    if (handleRightBadgeClick) {
      rightBadge = (
        <div className="badge right" onClick={handleRightBadgeClick} title="Delete card">
          <Icon name="trash outline" />
        </div>
      )
    }

    return (
      <div className={`Card ${card.type}`}>
        {leftBadge}
        {rightBadge}
        <div className="card-content">
          {validUrl.isUri(card.artURL) && (
            <img className="coverArt" src={card.artURL} alt="cover art" />
          )}
          <div className="metadata">
            <div className="titles">
              {card.title && <p className="title">{card.title}</p>}
              {card.subtitle && <p className="subtitle">{card.subtitle}</p>}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Card
