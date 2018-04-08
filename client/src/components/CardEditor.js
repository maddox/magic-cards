import React from 'react'
import gql from 'graphql-tag'
import {graphql, compose} from 'react-apollo'
import titleCase from 'title-case'
import validUrl from 'valid-url'

import {Form, Button} from 'semantic-ui-react'

import Card from './Card'

import '../styles/CardEditor.css'

class CardEditor extends React.Component {
  constructor(props) {
    super(props)

    const {card} = props

    this.state = {
      code: card.code,
      type: card.type || 'album',
      action: card.action,
      artURL: card.artURL,
      title: card.title,
      subtitle: card.subtitle,
      uri: card.uri,
    }
  }

  cardDataFromState() {
    return {
      code: this.state.code,
      type: this.state.type,
      action: this.state.action,
      artURL: this.state.artURL,
      title: this.state.title,
      subtitle: this.state.subtitle,
      uri: this.state.uri,
    }
  }

  handleUrl = event => {
    event.preventDefault()

    if (!validUrl.isUri(event.target.value)) {
      return
    }

    const action = this.props.data.actions.find(anAction => {
      return anAction.name === this.state.action
    })

    let type, title, subtitle, uri, artURL

    const sourceURL = new URL(event.target.value)

    if (sourceURL.host === 'itunes.apple.com') {
      if (sourceURL.pathname.includes('/album/')) {
        const collectionID = sourceURL.pathname.split('/').pop()
        const fragmentID = sourceURL.searchParams.get('i')
        const itunesID = fragmentID || collectionID

        fetch(`https://itunes.apple.com/lookup?id=${itunesID}`)
          .then(results => {
            return results.json()
          })
          .then(data => {
            const result = data.results[0]

            artURL = result.artworkUrl100.replace('100x100bb.jpg', '1400x1400bb.jpg')

            if (result.kind === 'song') {
              type = 'song'
              title = result.trackName
              subtitle = result.artistName
            } else if (result.collectionType === 'Album') {
              type = 'album'
              title = result.collectionName
              subtitle = result.artistName
            }

            if (action.type === 'sonos') {
              uri = `applemusic/next/${type}:${itunesID}`
            }

            this.setState({type: type, artURL: artURL, title: title, subtitle: subtitle, uri: uri})
          })
      } else {
        if (sourceURL.pathname.includes('/playlist/')) {
          type = 'playlist'
          title = titleCase(sourceURL.pathname.split('/')[3].replace('-', ' '))
          subtitle = 'Apple Music'
          artURL = ''
        } else if (sourceURL.pathname.includes('/station/')) {
          type = 'station'
          title = titleCase(sourceURL.pathname.split('/')[3].replace('-', ' '))
          subtitle = 'Apple Music'
          artURL = ''
        }

        this.setState({type: type, artURL: artURL, title: title, subtitle: subtitle})
      }
    }
  }

  handleSubmit = event => {
    event.preventDefault()
    const cardInput = this.cardDataFromState()
    let variables

    if (this.props.card.id) {
      variables = {id: parseInt(this.props.card.id, 10), cardInput: cardInput}

      this.props.updateCard({
        variables,
        optimisticResponse: {
          updateCard: {...cardInput, __typename: 'Card'},
        },
      })
    } else {
      variables = {cardInput: cardInput}

      this.props.createCard({
        variables,
        update: (store, {data: {createCard}}) => {
          const query = gql`
            query {
              cards {
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
          const {cards} = store.readQuery({query})
          cards.push(createCard)

          store.writeQuery({query: query, data: {cards}})
        },
      })
    }

    this.props.handleRequestClose()
  }

  handleInputChange = event => {
    const {code, artURL, title, subtitle, uri} = event.target.form
    this.setState({
      code: code.value,
      artURL: artURL.value,
      title: title.value,
      subtitle: subtitle.value,
      uri: uri.value,
    })
  }

  handleActionChange = (event, data) => {
    this.setState({
      action: data.value,
    })
  }

  handleTypeChange = (event, data) => {
    this.setState({
      type: data.value,
    })
  }

  onKeyPress = event => {
    if (event.which === 13) {
      event.preventDefault()
    }
  }

  render() {
    const {actions} = this.props.data
    const card = this.cardDataFromState()
    let actionOptions = []

    if (actions) {
      actionOptions = actions.map(action => {
        return {text: action.name, value: action.name}
      })

      if (!card.action) {
        this.setState({action: actionOptions[0].value})
      }
    }

    const types = ['Album', 'Song', 'Playlist', 'Station', 'Movie', 'Show', 'Channel', 'Event']
    const typeOptions = types.map(type => {
      return {text: type, value: type.toLowerCase()}
    })

    const submitButtonTitle = this.props.card.id ? 'Save Card' : 'Create Card'

    return (
      <div className="CardEditor">
        <Card card={card} />

        <Form>
          <Form.Input
            type="search"
            label="Add content by URL"
            name="query"
            placeholder="https://itunes.apple.com/us/album/moana-original-motion-picture-soundtrack-deluxe-edition/1168827405"
            onChange={this.handleUrl}
          />
        </Form>

        <h1>Card Data</h1>

        <Form onKeyPress={this.onKeyPress}>
          <Form.Group widths="equal">
            <Form.Field>
              <label>Content Type</label>
              <Form.Select
                name="type"
                value={card.type}
                onChange={this.handleTypeChange}
                options={typeOptions}
              />
            </Form.Field>
            <Form.Field>
              <label>Action</label>
              <Form.Select
                name="action"
                value={card.action}
                onChange={this.handleActionChange}
                options={actionOptions}
              />
            </Form.Field>
          </Form.Group>

          <Form.Group widths="equal">
            <Form.Input
              label="Title"
              type="text"
              name="title"
              value={card.title}
              placeholder="Yellow Submarine"
              onChange={this.handleInputChange}
            />
            <Form.Input
              label="Subtitle"
              type="text"
              name="subtitle"
              value={card.subtitle}
              placeholder="The Beatles"
              onChange={this.handleInputChange}
            />
          </Form.Group>

          <Form.Group widths="equal">
            <Form.Input
              label="Card Code"
              type="text"
              name="code"
              value={card.code}
              placeholder="4c00795451"
              onChange={this.handleInputChange}
            />
            <Form.Input
              label="URI"
              type="text"
              name="uri"
              value={card.uri}
              placeholder="spotify:user:spotify:playlist:37i9dQZF1DX0XUsuxWHRQd"
              onChange={this.handleInputChange}
            />
          </Form.Group>

          <Form.Input
            label="Art URL"
            type="text"
            name="artURL"
            value={card.artURL}
            placeholder="http://is1.mzstatic.com/image/thumb/Music2/v4/a2/66/32/a2663205-663c-8301-eec7-57937c2d0878/source/1400x1400bb.jpg"
            onChange={this.handleInputChange}
          />

          <Button secondary={true} onClick={this.props.handleRequestClose}>
            Cancel
          </Button>
          <Button primary={true} onClick={this.handleSubmit}>
            {submitButtonTitle}
          </Button>
        </Form>
      </div>
    )
  }
}

const createCard = gql`
  mutation($cardInput: CardInput!) {
    createCard(input: $cardInput) {
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

const updateCard = gql`
  mutation($id: ID!, $cardInput: CardInput!) {
    updateCard(id: $id, input: $cardInput) {
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
const actionsQuery = gql`
  query {
    actions {
      name
      type
    }
  }
`

export default compose(
  graphql(createCard, {name: 'createCard'}),
  graphql(updateCard, {name: 'updateCard'}),
  graphql(actionsQuery),
)(CardEditor)
