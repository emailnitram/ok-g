/*global SpeechKITT annyang*/
/*eslint no-undef: "error"*/

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      city: '',
      currentLatLng: {}
    }
  }

  componentDidMount() {
    let that = this;
    if (annyang) {
      // Add our commands to annyang
      annyang.addCommands({
        'what\'s the weather in *location': function(location) {
          // that.setState({city: location})
          fetch(`http://api.opencagedata.com/geocode/v1/json?q=${location}&key=63b4939c29a8c68d4775f6138e28c874`).then(function(response) {
              // Convert to JSON
              return response.json();
            }).then(function(res) {
              let currentLatLng = res.results[0].geometry
              // Yay, `j` is a JavaScript object
              that.setState({
                city: location,
                currentLatLng
              })
            });
          SpeechKITT.abortRecognition()
        }
      });

      // Tell KITT to use annyang
      SpeechKITT.annyang();

      SpeechKITT.setInstructionsText('How can I help today?')
      SpeechKITT.setStartCommand(annyang.start);
      SpeechKITT.displayRecognizedSentence = true;

      // Define a stylesheet for KITT to use
      SpeechKITT.setStylesheet('//cdnjs.cloudflare.com/ajax/libs/SpeechKITT/0.3.0/themes/flat-pomegranate.css');

      // Render KITT's interface
      SpeechKITT.render();
    }

  }
  render() {
    if (!this.state.currentLatLng.hasOwnProperty('lat') && !this.state.currentLatLng.hasOwnProperty('lng')) {
      return (
        <div>
          try a new search
        </div>
      )
    }
    let that = this;
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React {this.state.city}</h2>
        </div>
        <p className="App-intro">
          <iframe id="forecast_embed" type="text/html" frameBorder="0" height="245" width="100%" key={that.state.city} src={`http://forecast.io/embed/#lat=${that.state.currentLatLng.lat}&lon=${that.state.currentLatLng.lng}&name=${that.state.city}`}> </iframe>
        </p>
      </div>
    );
  }
}

export default App;
