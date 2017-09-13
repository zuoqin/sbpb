/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Button,
  Picker,
  View,
  Linking,
  Image,
  ListView,
  ScrollView,

  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { Actions, ActionConst } from 'react-native-router-flux';
import PositionCell from './PositionCell';
import spinner from '../images/loading.gif';
GLOBAL = require('./global');

export default class PositionsScreen extends React.Component{
  static navigationOptions = {
    title: 'Клиент',
  };

  isUpdated = true;


  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      language: "js",
      isLoggedIn: true,

      isLoading: false,
      page: -1,
      searchMode: false,
      query: '',
      dataSource: this.ds.cloneWithRows(['7 Harsh Realities Of Life Millennials Need To Understand', 'Millennials. They may not yet be the present, but they’re certainly the future. These young, uninitiated minds will someday soon become our politicians, doctors, scientists, chefs, television producers, fashion designers, manufacturers, and, one would hope, the new proponents of liberty. But are they ready for it? It’s time millennials understood these 7 harsh realities of life so we don’t end up with a generation of gutless adult babies running the show.','Japanese Government Bond Futures Are Flash-Crashing (Again)', 'Remember that once-in-a-lifetime, ']),

    }
  };


  setClientAndPositions(){
    this.setState({selectedclient: this.props.clients[0].code});
    setTimeout(() => {
      // this will be executed every 200 ms
      // even when app is the the background
      this.getPositions();
      console.log('tic');
    }, 200); 
  }

  componentDidMount() {
  {
    setTimeout(() => {
      // this will be executed every 200 ms
      // even when app is the the background
      this.setClientAndPositions();
      console.log('tic');
    }, 200);     
    /*
    Linking.getInitialURL().then((url) => {
      AsyncStorage.removeItem('SberPBAppState');
      //AsyncStorage.setItem('UIExplorerAppState', JSON.stringify({isLoggedIn: false}));
      AsyncStorage.getItem('SberPBAppState', (err, storedString) => {
        const moduleAction = URIActionMap(this.props.appFromAppetizeParams);
        const urlAction = URIActionMap(url);
        const launchAction = moduleAction || urlAction;
        if (err || !storedString) {
          const initialAction = launchAction || {type: 'InitialAction'};
     
          this.setState(UIExplorerNavigationReducer(null, initialAction));
          this.setState({isLoggedIn: false});
          return;
        }
        const storedState = JSON.parse(storedString);
        if (launchAction) {
          if( storedState.isLoggedIn === undefined || storedState.isLoggedIn === null){
            storedState.isLoggedIn = false;
          }          
          this.setState(UIExplorerNavigationReducer(storedState, launchAction));
          return;
        }
        if( storedState.isLoggedIn === undefined ){
          storedState.isLoggedIn = false;
        }
        this.setState(storedState);
      });
    });*/}
  }

  getDataSource(positions: Array<any>): ListView.DataSource{
    this.isUpdated = false;
    this.setState({dataSource: this.ds.cloneWithRows(positions)});
    this.isUpdated = true;
    return this.state.dataSource.cloneWithRows(positions);
  }

  setPositions(responseData){
    console.log(responseData.length);
    this.setState({isLoading: false});
    this.getDataSource(responseData);
  };

  getPositions(){
    if (this.isUpdated == false) {
      this._showAlert('Download', 'Download page failed');
      return;
    }
    
    if (this.state.isLoading == true) {
      this._showAlert('Download', 'Downloading, please wait...');
      return;
    }
    this.setState({isLoading: true});

    var settings = {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + this.props.token,
      },
    };      
    fetch(GLOBAL.API_PATH + "api/position?client=" + this.state.selectedclient, settings)
      .then((response) => response.json())
      .then((responseData) => {
          this.setState({isLoading: false});
          this.setPositions(responseData);
          
          console.log('On Get Positions');
        })
      .catch((error) => {
        this._showAlert('Download', 'Download Positions failed with error: ' + error.message);
        this.setState({isLoading: false});
      });

  };


  compare(a,b) {
    if (a.code > b.code)
      return 1;
    if (a.code < b.code)
      return -1;
    return 0;
  }

  showclients(clients) {
    var sorted = clients.sort(this.compare);
    return sorted.map(function(client, i){
      return(
          <Picker.Item label={client.code} value={client.code} key={i} />
      );
    });
  }

  onClientChange(client, index){
    console.log('client=' + client + ' index=' + index);
    this.setState({selectedclient: client});

    // Start a timer that runs once after X milliseconds
    setTimeout(() => {
      // this will be executed every 200 ms
      // even when app is the the background
      this.getPositions();
      console.log('tic');
    }, 200); 
  }



  renderSeparator(
    sectionID: number | string,
    rowID: number | string,
    adjacentRowHighlighted: boolean
  ) {
    return (
      <View
        key={"SEP_" + sectionID + "_" + rowID}
        style={[styles.listView.rowSeparator, adjacentRowHighlighted && styles.listView.rowSeparatorHighlighted]}
      />
    );
  };


  renderRow(
    position: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunction: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {
    var sTitle = '123456789012345';
    var nLength = 15;
    if(position[0] !== undefined) 
    {
      console.log('position title: ' + position[0]);
      sTitle = position[0];
    }
    nLength = sTitle.length;
    return (
      <PositionCell
        position={position}
        securities = {this.props.securities}
        onSelect={() => this.selectMediaItem(position)}
        onHighlight={() => highlightRowFunction(sectionID,rowID)}
        onDeHighlight={() => highlightRowFunction(null,null)}
      />  
    );
  };



  _showAlert(title, message) {
    console.log('1111111Ask me later pressed');
    // Works on both iOS and Android
    Alert.alert(
      title,
      message,
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]
    )    
  }


  render() {    
      return (
        <View>
          <Picker
            selectedValue={this.state.selectedclient}
            onValueChange={(itemValue, itemIndex) => this.onClientChange(itemValue, itemIndex)}>
            {this.showclients(this.props.clients)}
          </Picker>

          {this.state.isLoading ?
            <Image source={spinner} style={styles.image} />
            :
            <ListView
              style={styles.list}
              dataSource={this.state.dataSource}
              renderRow={this.renderRow.bind(this)}
            />  
          }
        
        </View>
      )

  }


  selectMediaItem(positionItem) {

    var props = {onNavigate: this.props.passProps.onNavigate,
      empid: positionItem.empid,
      birthday: employeeItem.birthday,
      empname: employeeItem.empname
    }
    //this.props.passProps.onNavigate(UIExplorerActions.ModuleAction('NewEmployeeDetail', props));
  };


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  image: {
    width: 96,
    height: 96,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },  
});
