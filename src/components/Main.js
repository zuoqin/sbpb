import React, { Component } from 'react';
import { Router, Scene, Actions, ActionConst } from 'react-native-router-flux';

import LoginScreen from './LoginScreen';
import SecondScreen from './SecondScreen';
import PositionsScreen from './PositionsScreen';
import TradesScreen from './TradesScreen';

export default class Main extends Component {
  render() {
	  return (
	    <Router>
	      <Scene key="root">
	        <Scene key="loginScreen"
	          component={LoginScreen}
	          animation='fade'
	          hideNavBar={true}
	          initial={true}
	        />
            <Scene key="positionsScreen"
              component={PositionsScreen}
              animation='fade'
              hideNavBar={true}
	        />
            <Scene key="tradesScreen"
              component={TradesScreen}
              animation='fade'
              hideNavBar={true}
	        />
	      </Scene>
	    </Router>
	  );
	}
}