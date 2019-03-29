const fetch = require('node-fetch')
const fs = require('fs')

/**
* helper func: Request a GitHub access token, supplying credentials.
*
* credentials: {client_id, client_secret, code}
*
* @returns: A fetch promise parsed as JSON.
*/
const requestGithubToken = credentials => fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(credentials)
      }
   )
   .then( res => res.json() )
   .catch( error => {
      throw new Error(JSON.stringify(error))
   })

/**
* helper func: After obtaining a GitHub token, use
* this to access information -- specifically
* GitHub login, name, and profile picture --
* from the current user's account.
*
* @returns: A fetch promise 
*/
const requestGithubUserAccount = token => 
    fetch(`https://api.github.com/user?access_token=${token}`)
    .then( res => res.json() )
    .catch(throwError)

/* export func: Single asynchronous function that we can use
* to authorize a user with GitHub...
* used by: githubAuth resolver
*/
const authorizeWithGithub = async credentials => {
    const { access_token } = await requestGithubToken(credentials)
    const githubUser = await requestGithubUserAccount(access_token)
    return { ...githubUser, access_token }
}
    
//module.exports = { findBy, authorizeWithGithub, generateFakeUsers, uploadFile }
module.exports = { authorizeWithGithub }
