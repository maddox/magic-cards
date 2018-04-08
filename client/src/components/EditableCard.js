import React from 'react'
import gql from 'graphql-tag'
import {graphql, compose} from 'react-apollo'
import {Modal} from 'semantic-ui-react'

import Card from './Card'
import CardEditor from './CardEditor'

import '../styles/EditableCard.css'

class EditableCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {showModal: false}
  }

  handleRequestClose = event => {
    if (event) {
      event.preventDefault()
    }
    this.setState({showModal: false})
  }

  handleClick = event => {
    this.setState({showModal: !this.state.showModal})
  }

  deleteCard = event => {
    event.preventDefault()
    event.stopPropagation()

    if (!window.confirm('Are you sure you want to delete this card?')) {
      return
    }

    const cardID = this.props.card.id

    const variables = {id: cardID}

    this.props.deleteCard({
      variables,
      update: (store, {data: {deleteCard}}) => {
        const query = gql`
          query {
            cards {
              id
            }
          }
        `
        const {cards} = store.readQuery({query})
        store.writeQuery({
          query: query,
          data: {cards: cards.filter(e => e.id !== cardID)},
        })
      },
    })
  }

  testCard = event => {
    event.preventDefault()
    event.stopPropagation()

    const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '/'
    const testerURL = baseURL + '/test/' + this.props.card.code

    fetch(testerURL, {method: 'post'})
  }

  render() {
    const {card} = this.props

    return (
      <div>
        <div className="EditableCard" onClick={this.handleClick}>
          <Card
            card={card}
            handleLeftBadgeClick={this.testCard}
            handleRightBadgeClick={this.deleteCard}
          />
          <Modal
            open={this.state.showModal}
            onClose={this.handleRequestClose}
            size="large"
            dimmer={'blurring'}>
            <Modal.Header>Manage Card</Modal.Header>
            <Modal.Content>
              <CardEditor card={card} handleRequestClose={this.handleRequestClose} />
            </Modal.Content>
          </Modal>
        </div>
      </div>
    )
  }
}

const deleteCard = gql`
  mutation($id: ID!) {
    deleteCard(id: $id) {
      id
      code
      type
      action
      title
      subtitle
      artURL
      uri
    }
  }
`

export default compose(graphql(deleteCard, {name: 'deleteCard'}))(EditableCard)
