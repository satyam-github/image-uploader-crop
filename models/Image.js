const mongoose = require('mongoose');
/* 
    Image Schema for storing images in the 
    mongodb database
*/
const ImageSchema = new mongoose.Schema({
    imageName: {
        type: String,
        required: true
    },
    imageData: {
        type: String,
        required: true
    },
    croppedData: [
        {
            croppedImageName: {
                type: String,
                required: true
            },
            croppedImageUrl: {
                type: String,
                required: true
            }
        }
    ]
});

module.exports = Image = mongoose.model('image', ImageSchema);