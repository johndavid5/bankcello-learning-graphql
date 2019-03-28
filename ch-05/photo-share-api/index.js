// routes:
// (1) / for a homepage
// (2) /graphql for the GraphQL endpoint
// (3) /playground for the GraphQL Playground

const { readFileSync } = require('fs')

const { ApolloServer } = require('apollo-server-express')
//const { GraphQLScalarType } = require('graphql')

const express = require('express')
const expressPlayground = require('graphql-playground-middleware-express').default

const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')



const resolvers = require('./resolvers')


// 2. Create a new instance of the server.
// 3. Send it an object with typeDefs(the schema) and
//    resolvers.

// Call `express()` to create an Express application...
var app = express()

const server = new ApolloServer({
    typeDefs,
    resolvers
})

// Call `applyMiddleware` to allow middleware
// mounted on the same path.
server.applyMiddleware({ app })

// Create a home route
app.get('/', (req, res) => res.end('Welcome to the PhotoShare API'))

// Setup playground route at
// http://localhost:4000/playground
app.get('/playground', expressPlayground({
    endpoint: '/graphql' } )
)


// Listen on a specific port...
const LE_PORT = 4000
app.listen({port: LE_PORT }, () => 
    console.log(`GraphQL Server running at http://localhost:${LE_PORT}${server.graphqlPath}...`)
)


