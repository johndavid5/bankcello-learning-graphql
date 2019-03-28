const { GraphQLScalarType } = require('graphql')
var context = require('../context')

module.exports = {
    Photo: { 
        url: parent => {
            let url = `http://johnny.com/img/${parent.id}.jpg` 
            console.log("Photo.url: parent = ", parent, ", returnin' url = ", url ); 
            return url; 
        },
        postedBy: parent => {
            let sWho = "Photo::postedBy";
            console.log(`${sWho}: SHEMP: parent = `, parent, "...");

            console.log(`${sWho}: SHEMP: Moe, lookin' for findee in users widh' user.githublogin === parent.githubUser === '${parent.githubUser}'...widh users = `, context.users);

            let findee =  context.users.find( u => u.githubLogin === parent.githubUser )
            console.log(`${sWho}(): SHEMP: Moe, retoynin' findee = `, findee );
            return findee;
        },

        // Lookup taggedUsers in tags[] array...
        taggedUsers: parent => context.tags
        // Return an array of tags that only contain the
        // current photo
        .filter( tag => tag.photoID === parent.id )
        // Converts the array of tags into an
        // array of userIDs
        .map( tag => tag.userID )
        // Converts array of userIDs into an array
        // of user objects...
        .map( userID => context.users.find(u => u.githubLogin === userID ) )
    },

    User: {
        postedPhotos: parent => {
            return context.photos.filter( p => p.githubUser === parent.githubLogin)
        },
        // For inPhotos, look up from tags array...
        inPhotos: parent => context.tags
        // Returns an array of tags that only 
        // contain the current user
        .filter( tag => tag.userID === parent.id)
        // Converts the array of tags into an
        // array of photoIDs
        .map( tag => tag.photoID )
        // Converts array of photoIDs into an
        // array of photo objects
        .map( photoID => context.photos.find( p => p.id === photoID ))
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
}
