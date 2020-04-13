import React, { Component } from 'react';
import axios from 'axios';
import Spinner from './Spinner/Spinner';
import classes from './ImageUploader.module.css';

// This component loads cropped variants of a particular image

class Image extends Component {

    state = {
        src: null,
        imageName: null,
        croppedData: [],
        loaded: false
    }

    // Fetching cropped dimensions of an image from server
    componentDidMount() {
        const { match: { params } } = this.props;
        axios.get(`/images/${params.id}`)
          .then(response => {
              this.setState({
                  src: response.data[0].imageData,
                  imageName: response.data[0].imageName,
                  croppedData: response.data[0].croppedData,
                  loaded: true
              })

            //   console.log(response.data);
          })
          .catch(error => {
              console.log(error);
          });
    }

    // Download Handler to download the image
    onDownloadHandler = (contentType, base64Data, fileName) => {
        console.log("Inside onDownloadHandler()");
        const linkSource = `${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      }

    render() {

        let displayImages = <Spinner />

        // Display cropped images when loaded from server
        if(this.state.loaded) {
            displayImages = this.state.croppedData.map(image => {
                return (
                    <div key={image._id}
                         className={classes.ImageDetails}>
                        <h3>{image.croppedImageName}</h3>
                        <img
                            style={{margin: '10px'}}
                            src={image.croppedImageUrl}
                            alt={image.croppedImageName} />
                        <button
                            className={classes.Button}
                            onClick={() => 
                                this.onDownloadHandler
                                ('image/jpeg', image.croppedImageUrl, image.croppedImageName)}
                        >
                          Download
                      </button>
                    </div>
                )
            })
        }

        return (
            <div className={classes.Container}>
                <h1>All Cropped Images of different dimensions Images here</h1>
                <div className={classes.ImageDetails}>
                    <h3>Original Image</h3>
                    <img
                        src={this.state.src}
                        alt={this.state.imageName} 
                    />
                    <button
                        className={classes.Button}
                        onClick={() => 
                            this.onDownloadHandler
                            ('image/jpeg', this.state.src, "Original Image")}
                    >
                        Download
                    </button>
                </div>
                {displayImages}
            </div>
        );
    }
}

export default Image;