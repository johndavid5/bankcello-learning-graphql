const { ApolloServer } = require('apollo-server-express')
const { GraphQLScalarType } = require('graphql')
const express = require('express')
const expressPlayground = require('graphql-playground-middleware-express').default

// routes:
// (1) / for a homepage
// (2) /graphql for the GraphQL endpoint
// (3) /playground for the GraphQL Playground

const typeDefs = `

    # Custom scalar...
    scalar DateTime

    # PhotoCategory enum...
    enum PhotoCategory {
        SELFIE
        PORTRAIT
        ACTION
        LANDSCAPE
        GRAPHIC
    }

    # User type definition
    type User {
        githubLogin: ID!
        name: String
        avatar: String
        postedPhotos: [Photo!]!
        inPhotos: [Photo!]!
    }

    # Photo type definition
    type Photo {
        id: ID!
        url: String!
        name: String!
        description: String
        category: PhotoCategory!
        postedBy: User!
        taggedUsers: [User!]!
        created: DateTime!
    }

    # Return list of Photo's from allPhotos
    type Query {
        totalPhotos: Int!
        allPhotos(after: DateTime): [Photo!]!
    }

    # input type PostPhotoInput...
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
//var photos = []
var users = [
    { "githubLogin": "mHattrup", "name": "Mike Hattrup" },
    { "githubLogin": "gPlake", "name": "Gwen Plake"},
    { "githubLogin": "sSchmidt", "name": "Scott Schmidt" },
];

var photos = [
    { "id": "1", "name": "Dropping the Heart Chute",
      "description": "The heart chute is one of my favorite chutes",
      "category": "ACTION", "githubUser": "gPlake",
      "created": "3-28-1977"
    },
    { "id": "2", "name": "Enjoying the sunshine",
      "category": "SELFIE", "githubUser": "sSchmidt",
      "created": "1-2-1985"
    },
    { "id": "3", "name": "Gunbarrel 25",
      "description": "25 laps on gunbarrel today",
      "category": "LANDSCAPE", "githubUser": "sSchmidt",
      "created": "2018-05-15T19:09:57.308Z"
    }
]

var tags = [
  { "photoID": "1", "userID": "gPlake" },
  { "photoID": "2", "userID": "sSchmidt" },
  { "photoID": "2", "userID": "mHattrup" },
  { "photoID": "2", "userID": "gPlake" }
]


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
                ...args.input,
                created: new Date()
            }
            console.log(`postPhoto(): SHEMP: Pushin' newPhoto =${JSON.stringify(newPhoto)} onto photos, Moe...`);
            photos.push(newPhoto)
            // 3. Return the new photo...
            return newPhoto
        }
    },

    Photo: { 
        url: parent => {
            let url = `http://johnny.com/img/${parent.id}.jpg` 
            console.log("Photo.url: parent = ", parent, ", returnin' url = ", url ); 
            return url; 
        },
        postedBy: parent => {
            let sWho = "Photo::postedBy";
            console.log(`${sWho}: SHEMP: parent = `, parent, "...");

            console.log(`${sWho}: SHEMP: Moe, lookin' for findee in users widh' user.githublogin === parent.githubUser === '${parent.githubUser}'...widh users = `, users);

            let findee =  users.find( u => u.githubLogin === parent.githubUser )
            console.log(`${sWho}(): SHEMP: Moe, retoynin' findee = `, findee );
            return findee;
        },
        // Lookup taggedUsers in tags[] array...
        taggedUsers: parent => tags
        // Return an array of tags that only contain the
        // current photo
        .filter( tag => tag.photoID === parent.id )
        // Converts the array of tags into an
        // array of userIDs
        .map( tag => tag.userID )
        // Converts array of userIDs into an array
        // of user objects...
        .map( userID => users.find(u => u.githubLogin === userID ) )
    },

    User: {
        postedPhotos: parent => {
            return photos.filter( p => p.githubUser === parent.githubLogin)
        },
        // For inPhotos, look up from tags array...
        inPhotos: parent => tags
        // Returns an array of tags that only 
        // contain the current user
        .filter( tag => tag.userID === parent.id)
        // Converts the array of tags into an
        // array of photoIDs
        .map( tag => tag.photoID )
        // Converts array of photoIDs into an
        // array of photo objects
        .map( photoID => photos.find( p => p.id === photoID ))
    },
    DateTime: new GraphQLScalarType({
        name: 'DateTime',
        description: 'A valid date time value.',
        // We want to make sure that the `after`
        // argument is parsed into a JavaScript `Date`
        // object before it is sent to the resolver.
        // We can use the parseValue() function to pare
        // the values of incoming strings that are sent
        // along with queries.  Whatever parseValue()
        // returns is passed to the resolver arguments.
        parseValue: value => new Date(value),
        // When we query the photo's `created` field,
        // we want to make sure that the value returned
        // by this field contains a string in the ISO date-time
        // format.  Whenever a field returns a date value, we
        // serialize() that value as an ISO-formatted string.
        // The serialize function obtains the field values from
        // our object, and as long as that field contains a date
        // formatted as a JavaScript object or any valid `datetime`
        // string, it will always be returned by GraphQL in the ISO
        // `datetime` format.
        serialize: value => new Date(value).toISOString(),
        // The `after` argument is not being passed as a 
        // query variable.  Instead, it has been added directly
        // to the query document.  Before we can parse this value,
        // we need to obtain it from the query after it has been
        // parsed into an abstract syntax tree(AST).  
        // We use the parseLiteral() function to obtain these 
        // values from the query document before 
        // they are parsed.
        // The parseLiteral() function is used to obtain the
        // value of the date that was added directly to the
        // query document.  In this case, all we need to do
        // is return that value, but if needed, we could take
        // extra parsing steps inside this function.
        parseLiteral: ast => ast.value
    })

}/* const resolvers = */

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


