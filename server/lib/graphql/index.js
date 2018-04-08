const graphqlHTTP = require('express-graphql')
const graphQLSchema = require('./schema')
const rootResolvers = require('./resolvers')

const api = graphqlHTTP({
  schema: graphQLSchema,
  rootValue: rootResolvers,
  graphiql: true,
})

module.exports = api
