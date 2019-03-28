var context = require('../context'); 

module.exports = {
        totalPhotos: () => {
            console.log(`totalPhotos(): SHEMP: Retoynin' photos.length = ${context.photos.length}, Moe...`);
            return context.photos.length
        },

        allPhotos: () => context.photos
}
