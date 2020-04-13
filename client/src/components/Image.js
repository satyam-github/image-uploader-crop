import React, { Component } from 'react';
import axios from 'axios';
import Spinner from './Spinner/Spinner';

class Image extends Component {

    state = {
        src: null,
        imageName: null,
        croppedData: [],
        loaded: false
    }

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

    render() {

        let displayImages = <Spinner />

        if(this.state.loaded) {
            displayImages = this.state.croppedData.map(image => {
                return (
                    <div key={image._id}
                        style={{
                            display: 'flex',
                            flexFlow: 'column',
                            alignItems: 'center',
                            margin: '10px',
                            padding: '10px 0'
                        }}>
                        <h3>{image.croppedImageName}</h3>
                        <img
                            style={{margin: '10px'}}
                            src={image.croppedImageUrl}
                            alt={image.croppedImageName} />
                        
                    </div>
                )
            })
        }

        return (
            <div
                style={{
                    display: 'flex',
                    flexFlow: 'column',
                    alignItems: 'center',
                    margin: '50px',
                    padding: '10px 0'
                }}>
                <h1>All Cropped Images of different dimensions Images here</h1>
                <h3>Original Image</h3>
                <img
                    src={this.state.src}
                    alt={this.state.imageName} />
                {displayImages}
            </div>
        );
    }
}

export default Image;