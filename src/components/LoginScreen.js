import React, { Component, PropTypes } from 'react';
import Logo from './Logo';
import Form from './Form';
import Wallpaper from './Wallpaper';
import ButtonSubmit from './ButtonSubmit';
import SignupSection from './SignupSection';


import {
  //AsyncStorage,
  Alert,
} from 'react-native';

GLOBAL = require('./global');

import { Actions, ActionConst } from 'react-native-router-flux';

export default class LoginScreen extends Component {

    constructor(props) {
      super(props);
      this.state = {
        isLoading: false,
      }
      this.onLogin = this.onLogin.bind(this);
    }


    gotoPositions(){
      Actions.positionsScreen({securities: this.state.securities, clients: this.state.clients, token: this.state.token}); 
      //const goToPositions = () => Actions.positionsScreen({securities: this.state.securities, clients: this.state.clients, token: this.state.token}); 
      //goToPositions();
    }


    setSecuritiesList(responsedata){
      //this._showAlert('Download', 'Logged in successfull: ' + responsedata.access_token);
      //const { navigate } = this.props.navigation;
      this.setState(
        {
          securities: responsedata,
        },
        //() => AsyncStorage.setItem('SberPBAppState', JSON.stringify(this.state))
      );

      setTimeout(() => {
        this.gotoPositions();
      }, 200);

        
      //navigate('Positions', {token: this.state.token, clients: this.state.clients, securities: this.state.securities});
    };



    requestSecurities(){

      var authorization = 'Bearer ' + this.state.token;
    
      console.log('trying to login with token: ' + this.state.token);
      var settings = {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'authorization': authorization,
        },
      };
      fetch(GLOBAL.API_PATH + "api/security", settings)
        .then((response) => response.json())
        .then((responseData) => {
          this.setSecuritiesList(responseData);
          console.log(responseData[0]);
        })
        .catch((error) => {
          this._showAlert('GET Securities', 'Retrieve securities error: ' + error.message);
        })    
    }


    setClientsList(responsedata){
      //this._showAlert('Download', 'Logged in successfull: ' + responsedata.access_token);
      //const { navigate } = this.props.navigation;
      this.setState(
        {
          clients: responsedata,
        }
      );

      //navigate('Positions', {token: this.state.token, clients: this.state.clients, securities: this.state.securities});
      this.requestSecurities();
    };


    requestClients(){

      var authorization = 'Bearer ' + this.state.token;
    
      console.log('trying to retrieve clients with token: ' + this.state.token);
      var settings = {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'authorization': authorization,
        },      
      };      
      fetch(GLOBAL.API_PATH + "api/client", settings)
        .then((response) => response.json())
        .then((responseData) => {
          this.setClientsList(responseData);
          console.log(responseData[0]);
        })
        .catch((error) => {
          this._showAlert('GET Clients', 'Retrieve clients error: ' + error.message);
        })    
    }

    setLoginUser(responsedata){
      //this._showAlert('Download', 'Logged in successfull: ' + responsedata.access_token);
      this.setState(
        {
          isLoggedIn: true,
          token: responsedata.access_token
        },
        //() => AsyncStorage.setItem('SberPBAppState', JSON.stringify(this.state))
      );
      this.requestClients();
      //navigate('Positions', {token: this.state.token, clients: this.state.clients, securities: this.state.securities});
    };

    _showAlert(title, message) {
      //console.log('1111111Ask me later pressed');
      // Works on both iOS and Android
      Alert.alert(
        title,
        message,
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]
      )    
    }


	  onLogin(){
        if(this.state === null || this.state.password === undefined)
          return;
        var body = 'grant_type=password&username=' + this.state.username + '&password=' + this.state.password;
        this.setState({ isLoading: true });
        Actions.refresh()
        console.log('trying to login with body: ' + body);

        var settings = {
          method: "POST",
		      headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: body,
        };

        fetch(GLOBAL.API_PATH + "token", settings)
          .then((response) => response.json())
          .then((responseData) => {
            this.setLoginUser(responseData);
            console.log(responseData);
          })
          .catch((error) => {
            this._showAlert('Login', 'Logged in with error: ' + error.message);
            //this.state.isLoading = false;
            //caller.setState({ isLoading: false });
            //this.state.resultsData = this.setPageGetResult([]);//this.getDataSource([])
          })
	}


	render() {
		return (
			<Wallpaper>
				<Logo />
				<Form 
		          onUserNameChange={(event) => {
		            console.log('user name finished change');
		            var username = event.nativeEvent.text;
		            console.log(username);
		            this.setState({username: username});
		          }}

		          onPasswordChange={(event) => {
		            console.log('password finished editing');
		            var password = event.nativeEvent.text;
		            console.log(password);
		            this.setState({password: password});
		          }}
				/>
				
				<ButtonSubmit
          isLoading = {this.state.isLoading}
          onLogin = {(event) => {
		            this.onLogin();
		          }}
				/>
			</Wallpaper>
		);
	}
}
