
import React, { PureComponent } from 'react';
import ReactCrop from 'react-image-crop';
import axios from 'axios';
import 'react-image-crop/dist/ReactCrop.css';
import Spinner from './Spinner/Spinner';
import classes from './ImageUploader.module.css';

/*  This is the Home page of application . It lets the user upload image 
    of 1024 x 1024 px . If image of any other size is loaded , it disables
    the upload button and displays the message that the image is not of correct 
    size . 

    This page also displays the other four sizes by cropping the image .

    'react-image-crop' has been used for cropping the image . 
    'axios' is used for posting the upload request to server .
 */

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

  /* This method/function fetches the file which the user uploads and sets the
      image source in the state . It also checks the sizes of image and 
      enables/disables the "Upload to Server" button .*/

  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      // Reseting the disabled and croppedImage state in the beginning
      this.setState({
        ...this.state,
        disabled: true,
        croppedImage: []
      });
      
      const reader = new FileReader();
      reader.addEventListener('load', () => {

        //  setting the source of image
        this.setState({ src: reader.result })
        var img = document.createElement("img")
        img.setAttribute("src", this.state.src)

        // checking the dimensions of image
        setTimeout(() => {
          if(img.height === 1024 && img.width === 1024) {
            this.setState({
              ...this.state,
              disabled: false
            })
          }
        },0);
      });
      reader.readAsDataURL(e.target.files[0]);
      
    }
  };

  /* This is one of the lifecycle method of 'react-image-crop' which 
      gets called after image is loaded 
  */

  onImageLoaded = image => {
    this.imageRef = image;
  };

  /* This lifecycle method is called when the user tries to crop the image
      In our application, we do not give any option to user to crop the image .
      Therefore, this method is called four times when our uploaded image is
      cropped into four sizes */

  onCropChange = (crop, percentCrop) => {
   
    this.setState({ crop });
    // console.log("Inside OnCropChange");
  };

  /* This lifecycle method is called when the user releases control of mouse
      while trying to crop the image . Since, we do not allow user to do this,
      this method is called four times when our image is cropped into four 
      sizes */

  onCropComplete = crop => {
    this.makeClientCrop(crop);
    // console.log("Inside onCropComplete");
  };

  /* This is not the lifecycle method but it is called from onCropComplete()
      to set the source of croppedImage . This method sends a function call
      with the crop data (telling how much to crop) to the canvas which 
      draws the images accordingly and returns the cropped image . */

  async makeClientCrop (crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        'newFile.jpeg'
      );

      /*  We have croppedImage [] state which stores the array of objects .
          This array of objects stores 'image name' and 'source url' of
          the four cropped images . Each time the image is cropped in a
          particular size , an object is made and pushed to array
          immutably so that the component is rendered again and cropped image
          is visible in the page */

      const oldCroppedImage = this.state.croppedImage;
      const croppedImageObj = {
        croppedImageName: "Dimension " + crop.width + "x" + crop.height,
        croppedImageUrl: croppedImageUrl
      }
      const updatedCroppedImage = oldCroppedImage.concat(croppedImageObj);
      
      this.setState({ 
        ...this.state,
        croppedImage: updatedCroppedImage
      });
      
    }
  }

  /* This function takes the image and crop information and crops the image
      It then returns the source of image back */

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

  // This method is for downloading the image

  onDownloadHandler = (contentType, base64Data, fileName) => {
    console.log("Inside onDownloadHandler()");
    // const linkSource = `data:${contentType};base64,${base64Data}`;
    const linkSource = `${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  /* This is an event handler which gets called when user clicks on 
    Submit button to upload it to database . The request is then posted
    to server . */

  onSubmitHandler = async event => {

    // Constructing image object 

    let imageObj = {
      imageName: "Original Image",
      imageData: this.state.src,
      croppedData: this.state.croppedImage
    };

    try {
    /* Setting the spin state to true in order to display a spinner 
        while the server is saving the image to the database */
      this.setState({
        ...this.state,
        spin: true
      })

      /* Post request to send image to server and setting spin to false
          when the image is successfully saved . Else an alert is displayed
          with error message . */
      await axios.post('/images', imageObj);
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

    /* <ReactCrop> from react-image-crop is called four times only
      if the disabled state is set to false (which is when image dimensions
        are 1024 x 1024) . crops[] contains the height and width of the
        'to be cropped' images which are then passed to lifecycle methods of
        <ReactCrop> . The images is thus cropped into four sizes . */

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

    return (
      <div className={classes.Container}>
      
      {/* Taking input for the image file */}

            <input type="file" accept="image/*" onChange={this.onSelectFile} />
            <button
              className={classes.ImageUploadButton}
              disabled={this.state.disabled}
              onClick={this.onSubmitHandler}>
              Upload to Server
            </button>

      {/* Spinner if the spin is set to true */}

            {this.state.spin && <Spinner />}

       {/* Display message when the image is successfully uploaded to server    */}

          {this.state.uploadStatus && 
            <p className={classes.Message}>Image uploaded Successfully</p>}

      {/* Asking user to upload only 1024 x 1024 px images */}

          {disabled && 
          <p>Upload image of size 1024 x 1024 to enable Submit button </p>}  

            {src && disabled && <p>Your Image does not have correct dimensions . 
                  Try uploading some other image</p>}
            
        {/* Displaying the original image Download option */}

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

            {/* Displaying the cropped images of four sizes */}

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
