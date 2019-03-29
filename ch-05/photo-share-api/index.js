// routes:
// (1) / for a homepage
// (2) /graphql for the GraphQL endpoint
// (3) /playground for the GraphQL Playground

const { readFileSync } = require('fs')

const { ApolloServer } = require('apollo-server-express')
//const { GraphQLScalarType } = require('graphql')

const express = require('express')
const expressPlayground = require('graphql-playground-middleware-express').default

const { MongoClient } = require('mongodb')

// https://www.npmjs.com/package/dotenv
// Dotenv is a zero-dependency module that loads
// environment variables from a .env file into process.env.
// Storing configuration in the environment separate from code
// is based on The Twelve-Factor App methodology.
require('dotenv').config()

const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')

const resolvers = require('./resolvers')

async function start(){
  // Call `express()` to create an Express application...
  const app = express(); 
  const MONGO_DB = process.env.DB_HOST

  console.log(`Connecting to MongoDB at ${MONGO_DB}...`)
  const client = await MongoClient.connect(
    MONGO_DB,
    { useNewUrlParser: true }
  )
  console.log(`...done connecting to MongoDB...`)

  const db = client.db()

  const context = { db }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context
  })

  // Call `applyMiddleware` to allow middleware
  // mounted on the same path.
  server.applyMiddleware({ app })

  // Create a home route at http://localhost:4000/
  app.get('/', (req, res) => res.end('Welcome to the PhotoShare API'))

  // Setup playground route at
  // http://localhost:4000/playground
  app.get('/playground', expressPlayground({
    endpoint: '/graphql' } )
  )

  // Listen on a specific port...
  //
  // Setup graphql route at
  // http://localhost:4000/graphql/
  const LE_PORT = 4000
  app.listen({port: LE_PORT }, () => 
    console.log(`GraphQL Server running at http://localhost:${LE_PORT}${server.graphqlPath}...`)
)

}/* start() */


// Invoke start() when ready to start...
start()

