const { authorizeWithGithub } = require('../lib')

module.exports = {
        //postPhoto(parent, args){ 
        //    console.log(`postPhoto(): SHEMP: parent = `, parent );
        //    console.log(`postPhoto(): SHEMP: args = `, args );
        //    var newPhoto = {
        //        id: _id++,
        //        ...args.input,
        //        created: new Date()
        //    }
        //    console.log(`postPhoto(): SHEMP: Pushin' newPhoto =${JSON.stringify(newPhoto)} onto photos, Moe...`);
        //    photos.push(newPhoto)
        //    // 3. Return the new photo...
        //    return newPhoto
        //}

    async githubAuth(parent, { code }, { db }){
        let {
            message,
            access_token, 
            avatar_url,
            login,
            name
        } = await authorizeWithGithub({ 
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code
        })
    }
}
