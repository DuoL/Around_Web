import React, { Component } from 'react';
import {Header} from './Header';
import {Main} from './Main';
import '../styles/App.css';

class App extends Component {
    //pass the state and loginHandler to lower level by props: Main.js and Login.js
    state = {
        isLoggedIn: false,
    }
    loginHandler = (response) => {

        this.setState({isLoggedIn: true});
    }
  render() {
    return (
      <div className="App">
          <Header/>
          <Main isLoggedIn={this.state.isLoggedIn} loginHandler={this.loginHandler}/>
      </div>
    );
  }
}

export default App;
