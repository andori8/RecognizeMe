import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/navigation/Navigation';
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
    box: {}
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

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions}/>
        <Navigation />
        <Logo />
        <Rank />
        <SearchBox handleChange={this.handleChange} onSubmit={this.handleSubmit}/>
        <FaceRecognition box={this.state.box} url={this.state.url}/>
      </div>
    );
  }
}

export default App;
