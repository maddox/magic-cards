import React from 'react'
import ReactDOM from 'react-dom'
import {ApolloClient} from 'apollo-client'
import {createHttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {ApolloProvider} from 'react-apollo'

import 'semantic-ui-css/semantic.min.css'

import App from './App'

const indexJsx = () => {
  const link = createHttpLink('http://localhost:5000/graphql')
  const cache = new InMemoryCache()
  const client = new ApolloClient({link, cache})

  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  )
}

ReactDOM.render(indexJsx(), document.getElementById('root'))
