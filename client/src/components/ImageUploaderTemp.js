import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import ReactCrop from 'react-image-crop';
import FileBase from 'react-file-base64';
import classes from './ImageUploader.module.css';
import 'react-image-crop/dist/ReactCrop.css';

import {
    base64StringtoFile,
    downloadBase64File,
    extractImageFileExtensionFromBase64,
    image64toCanvasRef
} from './Utility'

const imageMaxSize = 1000000000 // bytes
const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif'
const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => {return item.trim()})

class ImageUploader extends Component {

    constructor(props){
        super(props)
        this.imagePreviewCanvasRef = React.createRef()
        this.fileInputRef = React.createRef()
        this.state = {
            imgSrc: null,
            height: 0,
            width: 0,
            disabled: true,
            crop: {
                
            }
        }
    }

    componentDidUpdate (prevProps, prevState) {

        if (this.state.width !== prevState.width 
            & this.state.height !== prevState.height
            & this.state.width === 1024 
            & this.state.height === 1024 ) {
                this.setState({
                    ...this.state,
                    disabled: false
                })
            }
        // console.log("croppedImageUrl : " + this.state.)
        var img = document.createElement("img");
        img.setAttribute("src", this.state.croppedImageUrl);
        setTimeout(() => {
            console.log("Cropped Image dimension : " + img.height + " " + img.width);
        },0);
        // console.log("Component did update : " + this.state.height + " " + this.state.width);
    }

    // onSelectFile = e => {
    //     if (e.target.files && e.target.files.length > 0) {
    //       const reader = new FileReader();
    //       reader.addEventListener("load", () =>
    //         this.setState({ src: reader.result })
    //       );
    //       reader.readAsDataURL(e.target.files[0]);
    //     }
    //   };    

    getBaseFile = (files) => {

         // imageBase64Data 
        this.setState({
            imgSrc: files.base64
        });
      
        let imageObj = {
            imageName: "base-image-" + Date.now(),
            imageData: files.base64.toString()
        }; 

        var img = document.createElement("img")
        img.setAttribute("src", this.state.imgSrc)
        setTimeout(() => {
            this.setState({
                ...this.state,
                height: img.height,
                width: img.width
            })
            console.log("Inside Timeout : " + img.height + " " + img.width);
        },0);                
    }

    getCroppedImg(image, pixelCrop, fileName) {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(
            image,
            pixelCrop.x * scaleX,
            pixelCrop.y * scaleY,
            pixelCrop.width * scaleX,
            pixelCrop.height * scaleY,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height,
        );
        return canvas.toDataURL('image/jpeg');
    
        // return new Promise((resolve, reject) => {
        //   canvas.toBlob(file => {
        //     file.name = fileName;
        //     window.URL.revokeObjectURL(this.fileUrl);
        //     this.fileUrl = window.URL.createObjectURL(file);
        //     resolve(this.fileUrl);
        //   }, "image/jpeg");
        // });
      }

    onImageLoaded = (image, pixelCrop) => {
        console.log("onImageLoaded", image, pixelCrop);
        this.imageRef = image;
    };

    onChange = (crop, pixelCrop) => {
        console.log(crop, pixelCrop)
        this.setState({ crop })
      }

    onCropComplete = async (crop, pixelCrop) => {
        const croppedImageUrl = await this.getCroppedImg(
            this.imageRef,
            pixelCrop,
            "newFile.jpeg"
          );
          this.setState({ croppedImageUrl });
    };

    onCropChange = crop => {
        this.setState({ crop });
    };
    

    render() {
        const { croppedImageUrl } = this.state;

        return (
            <div className={classes.process}>
                <h4 className={classes.ImageHeading}>Process: Using Base64</h4>
                <p className={classes.ImageDetails}>Upload image as Base64 directly to MongoDB database</p>
                <div className={classes.ImageUploadButton}>
                <FileBase 
                    type="file" 
                    multiple={false} 
                    onDone={this.getBaseFile.bind(this)} />

                <button
                    disabled={this.state.disabled}>
                        Upload Your Image
                </button>
                </div>

                {this.state.imgSrc && (
                    <ReactCrop
                        src={this.state.imgSrc}
                        crop={this.state.crop}
                        onImageLoaded={this.onImageLoaded}
                        onComplete={this.onCropComplete}
                        onChange={this.onCropChange}
                    />
                )}
                {croppedImageUrl && <img alt="Crop" src={croppedImageUrl} />}
          </div>
        );
    }
}

export default ImageUploader;