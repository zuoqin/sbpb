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
  SectionList,
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
const Dimensions = require('Dimensions');
const AndroidWindow = Dimensions.get('window');


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
      positions: [],
      isLoading: false,
      page: -1,
      searchMode: false,
      query: '',
      dataSource: this.ds.cloneWithRows(['7 Harsh Realities Of Life Millennials Need To Understand', 'Millennials. They may not yet be the present, but they’re certainly the future. These young, uninitiated minds will someday soon become our politicians, doctors, scientists, chefs, television producers, fashion designers, manufacturers, and, one would hope, the new proponents of liberty. But are they ready for it? It’s time millennials understood these 7 harsh realities of life so we don’t end up with a generation of gutless adult babies running the show.','Japanese Government Bond Futures Are Flash-Crashing (Again)', 'Remember that once-in-a-lifetime, ']),

    }
  };

  gotoTrades(){
    Actions.tradesScreen({securities: this.state.securities, clients: this.state.clients, token: this.state.token}); 
    //const goToPositions = () => Actions.positionsScreen({securities: this.state.securities, clients: this.state.clients, token: this.state.token}); 
    //goToPositions();
  }

  setClientAndPositions(){
    this.setState({selectedclient: 'AGGRESSIVE'});
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
    this.setState({positions: positions});

    for (var i=0; i < positions.length; i++) {
      var bfound = false;
      for (var k=0; k < this.props.securities.length; k++) {
          if (this.props.securities[k].id === Number(positions[i][0])) {
              console.log('found sec11111: ' + this.props.securities[k].acode);
              bfound = true;
              break;              
          }
      }
      if(bfound === false)
      {
        console.log('not found sec: ' + positions[i][0]);
      }
    }


    return this.state.dataSource.cloneWithRows(positions);


  }

  setPositions(responseData){

    console.log(responseData.length);
    this.setState({isLoading: false, positions: responseData});
    //this.getDataSource(responseData);
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
    this.setState({dataSource: this.ds.cloneWithRows([])});

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


  renderHeader(){
    return(
      <View>
        <Picker
          selectedValue={this.state.selectedclient}
          onValueChange={(itemValue, itemIndex) => this.onClientChange(itemValue, itemIndex)}>
          {this.showclients(this.props.clients)}
        </Picker>
      </View>
    );
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
      //console.log('position title: ' + position[0]);
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

  getAssets(assettype, positions, securities){
    return positions.filter(function(position){
      for (var k=0; k < securities.length; k++) {
          if (securities[k].id === Number(position[0])) {
              //console.log('found sec11111: ' + this.props.securities[k].acode);
              //bfound = true;
              if(securities[k].assettype == assettype){
                return true;
              }
              else{
                return false;
              } 
          }
      }
    });    
  }

  renderSectionHeader(section){
    return(
      <View style={{flex: 1, flexDirection: 'column'}}>
        <View>
          <Text style={{fontWeight: 'bold'}}>{section.section.title}</Text>
        </View>
        <View style={{flex: 1, flexDirection: 'row', padding: 1}}>
          <Text style={{width: 90,  textAlign: 'center', fontWeight: 'bold'}}>Инструмент</Text>
          <Text style={{width: 90, textAlign: 'center', fontWeight: 'bold'}}>Количество</Text>
          <Text style={{width: 100, textAlign: 'center', fontWeight: 'bold'}}>Цена приобретения</Text>
          <Text style={{width: 100, textAlign: 'center', fontWeight: 'bold'}}>Прибыль USD</Text>
        </View>
      </View>
    )
  }

  render() {
      if(this.state.isLoading == true){
        return(<Image source={spinner} style={styles.image} />);
      }   
      else{
            return(
            <View>
              <Picker
                selectedValue={this.state.selectedclient}
                onValueChange={(itemValue, itemIndex) => this.onClientChange(itemValue, itemIndex)}>
                {this.showclients(this.props.clients)}
              </Picker>            
              <SectionList
                securities={this.props.securities}
                positions={this.state.positions}
                renderSectionHeader={this.renderSectionHeader.bind(this)}           
                style={styles.list}

                sections={[
                  {data: this.getAssets(1, this.state.positions, this.props.securities), title: "Stocks"},
                  {data: this.getAssets(5, this.state.positions, this.props.securities), title: "Bonds"},
                  {data: this.getAssets(15, this.state.positions, this.props.securities), title: "Derivatives"},
                ]}              
                
                renderItem={this.renderRow.bind(this)}
                renderHeader={this.renderHeader.bind(this)}
              />
            </View>
            )   
      }
  }


  selectMediaItem(positionItem) {
    Actions.tradesScreen(
      {
        selectedclient: this.state.selectedclient,
        selectedsecurity: positionItem.item[0],
        securities: this.props.securities,
        clients: this.props.clients,
        token: this.props.token
      }
    ); 
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
    padding: 0,
    marginTop: 0,
    height: 587,
    
  },  
});
