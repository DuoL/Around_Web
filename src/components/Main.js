import React from 'react';
import { Register } from "./Register";
import { Login } from "./Login";
import { Home } from "./Home";
import { Switch, Route } from 'react-router-dom';

export class Main extends React.Component {
    //use the getLogin function to pass loginHandler to lower level: Login.js
    getLogin = () => {
        return this.props.isLoggedIn? <Home/> : <Login loginHandler={this.props.loginHandler}/>;
    }
    getHome = () => {
        return this.props.isLoggedIn? <Home/> : <Login loginHandler={this.props.loginHandler}/>;
    }
    render() {
        return (
            <div className="main">
                <Switch>
                    <Route exact path="/" render={this.getLogin} />
                    <Route path="/register" component={Register}/>
                    <Route path="/login" render={this.getLogin}/>
                    <Route path="/home" render={this.getHome}/>
                    <Route render={this.getLogin}/>
                </Switch>
            </div>
        );
    }
}