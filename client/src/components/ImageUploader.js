
import React, { PureComponent } from 'react';
import ReactCrop from 'react-image-crop';
import axios from 'axios';
import 'react-image-crop/dist/ReactCrop.css';
import Spinner from './Spinner/Spinner';
import classes from './ImageUploader.module.css';

class ImageUploader extends PureComponent {
  state = {
    src: null,
    disabled: true,
    spin: false,
    uploadStatus: false,
    croppedImage: [],
    crops: 
    [
      {
        id: 1,
        x: 0,
        y: 0,
        height: 450,
        width: 755
      },
      {
        id: 2,
        x: 0,
        y: 0,
        height: 450,
        width: 365
      },
      {
        id: 3,
        x: 0,
        y: 0,
        height: 365,
        width: 212
      },
      {
        id: 4,
        x: 0,
        y: 0,
        height: 380,
        width: 380
      }
    ]
  };

  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      // console.log("Inside select File");
      this.setState({
        ...this.state,
        disabled: true,
        croppedImage: []
      });
      // console.log("State Reset");
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.setState({ src: reader.result })
        var img = document.createElement("img")
        img.setAttribute("src", this.state.src)
        setTimeout(() => {
          if(img.height === 1024 || img.width === 1024) {
            this.setState({
              ...this.state,
              disabled: false
            })
          }
          // console.log("Inside Timeout : " + img.height + " " + img.width);
        },0);
      });
      reader.readAsDataURL(e.target.files[0]);
      
    }
  };

  // If you setState the crop in here you should return false.
  onImageLoaded = image => {
    this.imageRef = image;
  };

  onCropComplete = crop => {
    this.makeClientCrop(crop);
    // console.log("Inside onCropComplete");
  };

  onCropChange = (crop, percentCrop) => {
   
    this.setState({ crop });
    // console.log("Inside OnCropChange");
  };

  async makeClientCrop (crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        'newFile.jpeg'
      );
      const oldCroppedImage = this.state.croppedImage;
      const croppedImageObj = {
        croppedImageName: "Dimension " + crop.width + "x" + crop.height,
        croppedImageUrl: croppedImageUrl
      }
      const updatedCroppedImage = oldCroppedImage.concat(croppedImageObj);
      // console.log("Inside makeClientCrop Start");
      this.setState({ 
        ...this.state,
        croppedImage: updatedCroppedImage
      });
      // console.log("Inside makeClientCrop Stop" + this.state.croppedImage);
    }
  }

  getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
    // console.log("Inside getCroppedImg()");

    return canvas.toDataURL('image/jpeg');
  }

  onDownloadHandler = (contentType, base64Data, fileName) => {
    console.log("Inside onDownloadHandler()");
    // const linkSource = `data:${contentType};base64,${base64Data}`;
    const linkSource = `${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  onSubmitHandler = async event => {
    // console.log(this.state.croppedImage);

    let imageObj = {
      imageName: "Original Image",
      imageData: this.state.src,
      croppedData: this.state.croppedImage
    };

    try {
      // console.log(imageObj);
      this.setState({
        ...this.state,
        spin: true
      })
      await axios.post('http://localhost:5000/images', imageObj);
      this.setState({
        ...this.state,
        spin: false,
        uploadStatus: true
      })
      } catch (err) {
          alert("Error while uploading image");
      }
      setTimeout(() => {
        this.setState({
          ...this.state,
          uploadStatus: false
        })
      },3000);
  }

  render() {
    const { src, disabled } = this.state;
    let cropsImages = null;
    if (src && !disabled) {
      cropsImages = this.state.crops.map( crop => (
        <ReactCrop
          style={{
            position: 'absolute',
            left: '-10000px',
            top: 'auto',
            overflow: 'hidden'
          }}
          key={crop.id}
          src={src}
          crop={crop}
          ruleOfThirds
          onImageLoaded={this.onImageLoaded}
          onComplete={this.onCropComplete}
          onChange={this.onCropChange}
        />
      ))
    }

    // console.log("Inside render() : croppedImage Array " + croppedImage);

    return (
      <div className={classes.Container}>
          
            <input type="file" accept="image/*" onChange={this.onSelectFile} />
            <button
              className={classes.ImageUploadButton}
              disabled={this.state.disabled}
              onClick={this.onSubmitHandler}>
              Upload to Server
            </button>
            {this.state.spin && <Spinner percentage={this.state.percentage} />}
          
          {this.state.uploadStatus && 
            <p className={classes.Message}>Image uploaded Successfully</p>}
          
          {disabled && 
          <p>Upload image of dimension 1024 x 1024 to enable Submit button </p>}  

            {src && disabled && <p>Your Image does not have correct dimensions . 
                  Try uploading some other image</p>}
            
            {src && <div className={classes.ImageDetails}>
                <h3>Uploaded Image</h3>   
                <img src={this.state.src} alt="Original" /> 
                <button
                  className={classes.Button}
                  onClick={() => 
                    this.onDownloadHandler
                    ('image/jpeg', this.state.src, "Uploaded Image")}
                >
                    Download
                </button>
              </div> }

            {cropsImages}

            {this.state.croppedImage && 
              this.state.croppedImage.map( cropped => (
                <div 
                  key = {cropped.croppedImageName}
                  className = {classes.ImageDetails}>
                    <h3>{cropped.croppedImageName}</h3>
                    <img 
                      alt="Crop" 
                      style={{
                        padding: '10px auto',
                        margin: '10px auto'
                      }}
                      title={cropped.croppedImageName}
                      src={cropped.croppedImageUrl} />
                      <button
                        className={classes.Button}
                        onClick={() => this.onDownloadHandler('image/jpeg', cropped.croppedImageUrl, cropped.croppedImageName)}
                      >
                          Download
                      </button>
                </div>
              ))
            }
      
      </div>
    );
  }
}

export default ImageUploader;
