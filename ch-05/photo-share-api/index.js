// See also: https://www.apollographql.com/docs/apollo-server/essentials/server.html

// 1. Require 'apollo-server'
const { ApolloServer } = require('apollo-server')

const typeDefs = `

    # Add PhotoCategory enum...
    enum PhotoCategory {
        SELFIE
        PORTRAIT
        ACTION
        LANDSCAPE
        GRAPHIC
    }

    # Add Photo type definition
    type Photo {
        id: ID!
        url: String!
        name: String!
        description: String
        category: PhotoCategory!
    }

    # Return list of Photo's from allPhotos
    type Query {
        totalPhotos: Int!
        allPhotos: [Photo!]!
    }

    # Add input type PostPhotoInput...
    input PostPhotoInput {
        name: String!
        category: PhotoCategory=PORTRAIT
        description: String
    }

    # Return the newly posted photo from the mutation
    type Mutation {
        postPhoto(input: PostPhotoInput!): Photo!
    }
`

// 1. A variable we'll increment for unique ids...
var _id = 0
// 2. A data type to store our photos in memory...
var photos = []

const resolvers = {
    Query: { 
        totalPhotos: () => {
            console.log(`totalPhotos(): SHEMP: Retoynin' photos.length = ${photos.length}, Moe...`);
            return photos.length
        },
        allPhotos: () => photos
    },

    Mutation: {
        postPhoto(parent, args){ 
            console.log(`postPhoto(): SHEMP: parent = `, parent );
            console.log(`postPhoto(): SHEMP: args = `, args );
            var newPhoto = {
                id: _id++,
                ...args.input
            }
            console.log(`postPhoto(): SHEMP: Pushin' newPhoto =${JSON.stringify(newPhoto)} onto photos, Moe...`);
            photos.push(newPhoto)
            // 3. Return the new photo...
            return newPhoto
        }
    },

    // Create trivial resolver for Photo's url field...
    Photo: { 
        url: parent => {
            let url = `http://johnny.com/img/${parent.id}.jpg` 
            console.log("Photo.url: parent = ", parent, ", returnin' url = ", url ); 
            return url; 
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

