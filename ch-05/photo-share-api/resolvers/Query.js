
module.exports = {
        totalPhotos: (parent, args, { db } ) => {
            let the_count = db.collection('photos').estimatedDocumentCount()
            console.log(`totalPhotos(): SHEMP: Retoynin' db.collection('photos').estimatedDocumentCount = ${the_count}, Moe...`);
            return the_count
        },

        allPhotos: (parent, args, { db } ) =>
            db.collection('photos')
              .find()
              .toArray(),

        totalUsers: (parent, args, { db }) => 
            db.collection('users')
              .estimatedDocumentCount(),

        allUsers: (parent, args, { db }) => 
            db.collection('users')
              .find()
              .toArray()
}
