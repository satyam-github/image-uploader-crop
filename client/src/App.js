import React, { Component, Fragment } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navigation/Navbar';
import Image from './components/Image';
import Images from './components/Images';
import ImageUploader from './components/ImageUploader';

class App extends Component {
 
  render () {
    /* Creating routes for application . 
        
        /images fetches all images with original dimensions.

        /images/:id fetches the images of four different size 
        of the original image by passing id as params */

    return (
      <BrowserRouter>
        <Fragment>
          <Navbar />
          <Switch>
            <Route exact path="/images/:id" component={Image} />
            <Route exact path="/images" component={Images} />
            <Route path="/" component={ImageUploader} />
          </Switch>
        </Fragment>
      </BrowserRouter>
      
    );
  }
    
  };

export default App;
