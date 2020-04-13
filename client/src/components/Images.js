import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Spinner from './Spinner/Spinner';
import classes from './ImageUploader.module.css';

class Images extends Component {

    state = {
        images: [],
        loaded: false
    };

    componentDidMount () {
        axios.get('/images')
          .then(response => {
              this.setState({
                  images: response.data,
                  loaded: true
              })
            //   console.log(this.state.images);
          })
          .catch(error => {
              console.log(error);
          });
      }

      render() {

        let displayImage = <Spinner />;

        if(this.state.loaded) {
          displayImage = this.state.images.map(image => (
                        <div key={image._id}
                             className={classes.ImageDetails}>
                            <img
                                src={image.imageData}
                                alt={image.imageName} />
                            <Link to={`/images/${image._id}`} className={classes.Message}>
                                Click to view Cropped Images with all Dimensions
                            </Link>
                        </div>
                    )
                )
        }

          return (
              <div
                style={{
                    display: 'flex',
                    flexFlow: 'column',
                    alignItems: 'center',
                    margin: '70px auto',
                    padding: '10px 0'
                }}>
                    <h1>See All Images Here</h1>
                    {displayImage}
              </div>
          )
      }
}

export default Images;