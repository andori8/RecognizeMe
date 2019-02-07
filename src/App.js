import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/navigation/Navigation';
import Signin from './components/signin/Signin';
import Register from './components/register/Register';
import Logo from './components/logo/Logo';
import Rank from './components/rank/Rank';
import SearchBox from './components/SearchBox/SearchBox';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

const app = new Clarifai.App({
 apiKey: "92e006c3c0e44434b879b87e1866b239"
});

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {
  state = {
    input: '',
    url: '',
    box: {},
    route: 'signin',
    signedIn: false
  }

  calculateFaceLocation = data => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = box => {
    this.setState({ box: box })
  }

  handleChange = e => {
    this.setState({ input: e.target.value })
  }

  handleSubmit = () => {
    this.setState({ url: this.state.input })
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if ( route === 'signout') {
      this.setState({ signedIn: false })
    } else if (route === 'home') {
      this.setState({ signedIn: true })
    }
    this.setState({ route: route })
  }

  render() {
    const { signedIn, url, route, box } = this.state
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions}/>
        <Navigation signedIn={signedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home' ?
        <div>
            <Logo />
            <Rank />
            <SearchBox handleChange={this.handleChange} onSubmit={this.handleSubmit}/>
            <FaceRecognition box={box} url={url}/>
          </div>
        : (
          route === 'signin' ?
          <Signin onRouteChange={this.onRouteChange}/>
          : <Register onRouteChange={this.onRouteChange}/>
        )
        }
      </div>
    );
  }
}

export default App;
