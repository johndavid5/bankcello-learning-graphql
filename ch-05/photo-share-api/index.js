// See also: https://www.apollographql.com/docs/apollo-server/essentials/server.html

// 1. Require 'apollo-server'
const { ApolloServer } = require('apollo-server')

const typeDefs = `

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
    }

    # Return list of Photo's from allPhotos
    type Query {
        totalPhotos: Int!
        allPhotos: [Photo!]!
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
    { "githubLogin": "mHattrup", "name": "Mike Hattrup"},
    { "githubLogin": "gPlake", "name": "Gwen Plake"},
    { "githubLogin": "sSchmidt", "name": "Scot Schmidt"},
];

var photos = [
    { "id": "1", "name": "Dropping the Heart Chute",
      "description": "The heart chute is one of my favorite chutes",
      "category": "ACTION", "githubUser": "gPlake" },
    { "id": "2", "name": "Enjoying the sunshine",
      "category": "SELFIE", "githubUser": "sSchmidt" },
    { "id": "3", "name": "Gunbarrel 25",
      "description": "25 laps on gunbarrel today",
      "category": "LANDSCAPE", "githubUser": "sSchmidt" }
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
                ...args.input
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

