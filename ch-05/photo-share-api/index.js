// See also: https://www.apollographql.com/docs/apollo-server/essentials/server.html

// 1. Require 'apollo-server'
const { ApolloServer } = require('apollo-server')

const typeDefs = `
    type Query {
        totalPhotos: Int!
    }
`

const resolvers = {
    Query: { 
        totalPhotos: () => 42
    }
}

// 2. Create a new instance of the server.
// 3. Send it an object with typeDefs(the schema) and
//    resolvers.

const server = new ApolloServer({
    typeDefs,
    resolvers
})

// 4. Call listen on the server to
//    launch the web server.
server
    .listen()
    .then(({url}) => 
        console.log(`GraphQL Service running on ${url}`)
    )

// 5. Easy Peazy Lemon Squeezy.

// A schema describes the data requirements
// but doesn't perform the work of getting
// that data.  That work is handled by
// resolvers.
//
// A resolver is a function that returns data for
// a particular field.  Resolver functions return
// data in the type and shape specified by the
// schema.  Resolvers can be asynchronous and
// can fetch or update date from a REST API,
// database, or any other service.

// The `typeDefs` variable is where we define
// our schema.  It's just a string.
// Whenever we create a query like `totalPhotos`,
// it should be backed by a resolver function of the
// same name.  The type definition describes which
// type the field should return.  The resolver function
// returns the data of that type from somewhere -- in this
// case, just a staic value of 42.
