import React, { Component } from 'react';
import { Header } from './Header';
import { Main } from './Main';
import { TOKEN_KEY } from "../constants";

import '../styles/App.css';

class App extends Component {
    //pass the state and loginHandler to lower level by props: Main.js and Login.js
    state = {
        //!! turn it into boolean and get the !
        isLoggedIn: !!localStorage.getItem(TOKEN_KEY),
    }
    loginHandler = (response) => {
        //use token_key to initialize the isLoggedIn
        localStorage.setItem(TOKEN_KEY, response);
        this.setState({isLoggedIn: true});
    }
  render() {
    return (
      <div className="App">
          <Header isLoggedIn={this.state.isLoggedIn}/>
          <Main isLoggedIn={this.state.isLoggedIn} loginHandler={this.loginHandler}/>
      </div>
    );
  }
}

export default App;
