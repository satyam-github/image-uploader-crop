var express = require('express');
var Image = require('../models/Image');
var router = express.Router();

// @POST route /images

router.post('/', async (req, res) => {

    const newImage = new Image({
        imageName: req.body.imageName,
        imageData: req.body.imageData,
        croppedData: req.body.croppedData
    });
    console.log(req.body);

    try {
        await newImage.save();
        return res.status(200).json(newImage);
    } catch (err) {
        console.log(err.message);
        return res.status(500).send('Data not saved');
    }
});

// @GET route /images
// gets all images which were originally uploaded (not the cropped ones) by user

router.get('/', async (req, res) => {
    try {
        const images = await Image.find().select({'imageName':1 ,'imageData': 1});
        res.json(images);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Unable to fetch Images");
    }
})

// @GET route /images/:id
// gets the cropped images of a particular image whose id is passed as params

router.get('/:id', async (req, res) => {
    try {   
        console.log("params id : " + req.params.id);
        const images = await Image.find({_id: req.params.id});
        res.json(images);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Unable to fetch these images");
    }
})

module.exports = router;