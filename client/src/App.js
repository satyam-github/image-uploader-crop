import React, { Component, Fragment } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navigation/Navbar';
import Image from './components/Image';
import Images from './components/Images';
import ImageUploader from './components/ImageUploader';

class App extends Component {

  // getBaseFile(files) {
  //   // create a local readable base64 instance of an image
  //   this.setState({
  //     baseImage: files.base64
  //   });

  //   let imageObj = {
  //     imageName: "base-image-" + Date.now(),
  //     imageData: files.base64.toString()
  //   };

  //   var img = document.createElement("img")
  //   img.setAttribute("src", this.state.baseImage)
  //   setTimeout(function(){
  //     console.log(img.height, img.width);
  //   },0)

  //   // const modifiedImage = this.cropDemo(this.state.baseImage);
  //   // this.setState({
  //   //   baseImage: modifiedImage
  //   // });

  //   // var img = document.createElement("img")
  //   // img.setAttribute("src", modifiedImage)
  //   // setTimeout(function(){
  //   //   console.log(img.height, img.width);
  //   // },0)

  //   axios.post(`${API_URL}/image`, imageObj)
  //     .then((data) => {
  //       if (data.data.success) {
  //         alert("Image has been successfully uploaded using base64 format");
  //       }
  //     })
  //     .catch((err) => {
  //       alert("Error while uploading image using base64 format");
  //     });
  // }
  
  render () {
    // console.log("Inside App");
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
