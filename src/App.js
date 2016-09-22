import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Forecast from 'react-forecast';


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
          console.log('Weather for: ', location);
          // that.setState({city: location})
          console.log('SpeechKITT', SpeechKITT)
          fetch(`http://api.opencagedata.com/geocode/v1/json?q=${location}&key=63b4939c29a8c68d4775f6138e28c874`).then(function(response) { 
              // Convert to JSON
              return response.json();
            }).then(function(res) {
              let currentLatLng = res.results[0].geometry
              // Yay, `j` is a JavaScript object
              // console.log('lat lng: ', j); 
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
    console.log('currentLatLng',this.state.currentLatLng)
    if (!this.state.currentLatLng.hasOwnProperty('lat') && !this.state.currentLatLng.hasOwnProperty('lng')) {
      return (
        <div>

        </div>
      )
    }
    console.log('city', this.state.city)
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          <iframe id="forecast_embed" type="text/html" frameborder="0" height="245" width="100%" src={`http://forecast.io/embed/#lat=${this.state.currentLatLng.lat}&lon=${this.state.currentLatLng.lng}&name=${this.state.city}`}> </iframe>
        </p>
      </div>
    );
  }
}

export default App;

          // <Forecast latitude={this.state.currentLatLng.lat} longitude={this.state.currentLatLng.lng} name={this.state.city} />