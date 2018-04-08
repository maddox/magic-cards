const {buildSchema} = require('graphql')

let schema = buildSchema(`
  input CardInput {
    code: String
    type: String
    action: String
    artURL: String
    title: String
    subtitle: String
    uri: String
  }

  type Card {
    id: ID
    code: String
    type: String
    action: String
    artURL: String
    title: String
    subtitle: String
    uri: String
  }

  type Action {
    name: String
    type: String
  }

  type Query {
    actions: [Action]
    cards: [Card]
    card(id: String): Card
  }

  type Mutation {
    createCard(input: CardInput!): Card
    updateCard(id: ID!, input: CardInput!): Card
    deleteCard(id: ID!): Card
  }
`)

module.exports = schema
