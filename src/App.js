import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/navigation/Navigation';
import Signin from './components/signin/Signin';
import Register from './components/register/Register';
import Logo from './components/logo/Logo';
import Rank from './components/rank/Rank';
import SearchBox from './components/SearchBox/SearchBox';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

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

const initialState = {
  input: '',
  url: '',
  box: {},
  route: 'signin',
  signedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = data => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
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
    fetch('https://serene-hamlet-90747.herokuapp.com/imageurl', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if (response) {
        fetch('https://serene-hamlet-90747.herokuapp.com/image', {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(res => res.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}))
        })
      }
    this.displayFaceBox(this.calculateFaceLocation(response))
  })
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if ( route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({ signedIn: true })
    }
    this.setState({ route: route })
  }

  render() {
    const { signedIn, url, route, box, user } = this.state
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions}/>
        <Navigation signedIn={signedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home' ?
        <div>
            <Logo />
            <Rank name={user.name} entries={user.entries}/>
            <SearchBox handleChange={this.handleChange} onSubmit={this.handleSubmit}/>
            <FaceRecognition box={box} url={url}/>
          </div>
        : (
          route === 'signin' ?
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        )
        }
      </div>
    );
  }
}

export default App;
