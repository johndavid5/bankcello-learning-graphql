// See also: https://www.apollographql.com/docs/apollo-server/essentials/server.html

// 1. Require 'apollo-server'
const { ApolloServer } = require('apollo-server')

const typeDefs = `
    type Query {
        totalPhotos: Int!
    }

    type Mutation {
        postPhoto(
            name: String! 
            description: String): Boolean!
    }
`

// 2. A data type to store our photos in memory...
var photos = []

const resolvers = {
    Query: { 
        totalPhotos: () => {
            console.log(`totalPhotos(): SHEMP: Retoynin' photos.length = ${photos.length}, Moe...`);
            return photos.length
        }
    },

    Mutation: {
        postPhoto(parent, args){ 
            console.log(`postPhoto(): SHEMP: parent = `, parent );
            console.log(`postPhoto(): SHEMP: Pushin' args=${JSON.stringify(args)} onto photos, Moe...`);
            photos.push(args)
            return true
        }
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

