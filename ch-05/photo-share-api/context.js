var context = {

// 1. A variable we'll increment for unique ids...
   _id: 0,

// 2. A data type to store our photos in memory...
//var photos = []
  users: [
    { "githubLogin": "mHattrup", "name": "Mike Hattrup" },
    { "githubLogin": "gPlake", "name": "Gwen Plake"},
    { "githubLogin": "sSchmidt", "name": "Scott Schmidt" },
  ],

  photos: [
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
],

tags: [
  { "photoID": "1", "userID": "gPlake" },
  { "photoID": "2", "userID": "sSchmidt" },
  { "photoID": "2", "userID": "mHattrup" },
  { "photoID": "2", "userID": "gPlake" }
]

}

module.exports = context;
