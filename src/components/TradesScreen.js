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
  FlatList,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native';

import { Actions, ActionConst } from 'react-native-router-flux';
import TradeCell from './TradeCell';
import spinner from '../images/loading.gif';
GLOBAL = require('./global');
const Dimensions = require('Dimensions');
const AndroidWindow = Dimensions.get('window');



BackHandler.addEventListener('hardwareBackPress', function() {
 // this.onMainScreen and this.goBack are just examples, you need to use your own implementation here
 // Typically you would use the navigator here to go to the last state.
 //Actions.pop();
 return true;
});



export default class TradesScreen extends React.Component{
  static navigationOptions = {
    title: 'Клиент',
  };

  isUpdated = true;


  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      isLoggedIn: true,
      trades: [],
      isLoading: false,
      page: -1,
      searchMode: false,
    }
  };

  gotoPositions(){
    Actions.tradesScreen({securities: this.state.securities, clients: this.state.clients, token: this.state.token}); 
    //const goToPositions = () => Actions.positionsScreen({securities: this.state.securities, clients: this.state.clients, token: this.state.token}); 
    //goToPositions();
  }

  requestTrades(){
    //this.setState({selectedclient: 'AGGRESSIVE'});
    setTimeout(() => {
      // this will be executed every 200 ms
      // even when app is the the background
      this.getTrades();
      //console.log('tic');
    }, 200); 
  }

  componentDidMount() {
    setTimeout(() => {
      // this will be executed every 200 ms
      // even when app is the the background
      this.requestTrades();
      //console.log('tic');
    }, 200);
  }

  // getDataSource(positions: Array<any>): ListView.DataSource{
  //   this.isUpdated = false;
  //   this.setState({dataSource: this.ds.cloneWithRows(positions)});
  //   this.isUpdated = true;
  //   this.setState({positions: positions});

  //   for (var i=0; i < positions.length; i++) {
  //     var bfound = false;
  //     for (var k=0; k < this.props.securities.length; k++) {
  //         if (this.props.securities[k].id === Number(positions[i][0])) {
  //             console.log('found sec11111: ' + this.props.securities[k].acode);
  //             bfound = true;
  //             break;              
  //         }
  //     }
  //     if(bfound === false)
  //     {
  //       console.log('not found sec: ' + positions[i][0]);
  //     }
  //   }


  //   return this.state.dataSource.cloneWithRows(positions);


  // }

  setTrades(responseData){

    //console.log(responseData.length);
    this.setState({isLoading: false, trades: responseData});
    //this.getDataSource(responseData);
  };

  getTrades(){
    if (this.isUpdated == false) {
      this._showAlert('Download', 'Download page failed');
      return;
    }
    
    if (this.state.isLoading == true) {
      this._showAlert('Download', 'Downloading, please wait...');
      return;
    }
    this.setState({isLoading: true});
    this.setState({trades: []});

    var settings = {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + this.props.token,
      },
    };      
    fetch(GLOBAL.API_PATH + "api/postran?client=" + this.props.selectedclient + "&security=" + this.props.selectedsecurity, settings)
      .then((response) => response.json())
      .then((responseData) => {
          this.setState({isLoading: false});
          this.setTrades(responseData);
          
          console.log('On Get Trades');
        })
      .catch((error) => {
        this._showAlert('Download', 'Download Trades failed with error: ' + error.message);
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
      <View style={{flex: 1, flexDirection: 'column'}}>
        <View style={{flex: 1, flexDirection: 'row', padding: 1}}>
          <Text style={{width: 90,  textAlign: 'center', fontWeight: 'bold'}}>Инструмент</Text>
          <Text style={{width: 90, textAlign: 'center', fontWeight: 'bold'}}>Количество</Text>
          <Text style={{width: 100, textAlign: 'center', fontWeight: 'bold'}}>Цена приобретения</Text>
          <Text style={{width: 100, textAlign: 'center', fontWeight: 'bold'}}>Прибыль USD</Text>
        </View>
      </View>
    )
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
    trade: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunction: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {
    var sTitle = '123456789012345';
    var nLength = 15;
    return (
      <TradeCell
        trade={trade}
        securities = {this.props.securities}
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

  searchsecs(secid){
    var found = false;
    for (var i=0; i < this.props.securities.length; i++) {
        if (this.props.securities[i].id === secid) {
            console.log('found sec: ' + this.props.securities[i].acode);
            return this.props.securities[i];
        }
    }
    console.log('sec not found: ' + secid);
  }

  render() {
      var security = this.searchsecs(parseInt(this.props.selectedsecurity));
      if(this.state.isLoading == true){
        return(<Image source={spinner} style={styles.image} />);
      }   
      else{
        return(
          <View>
            <View style={{height: 200, flex: 1, flexDirection: 'row', padding: 1}}>
              <Text style={{textAlign: 'left', fontWeight: 'normal'}}>Сделки клиента: </Text>
              <Text style={{textAlign: 'left', fontWeight: 'bold'}}>{this.props.selectedclient}</Text>
              <Text style={{textAlign: 'left', fontWeight: 'normal'}}> по инструменту: </Text>
              <Text style={{textAlign: 'center', fontWeight: 'bold'}}>{security.acode}</Text>
            </View>

            <View style={{height: 200, flex: 1, flexDirection: 'row', padding: 1}}>
              <Text style={{width: 90,  textAlign: 'center', fontWeight: 'bold'}}>Дата</Text>
              <Text style={{width: 90, textAlign: 'center', fontWeight: 'bold'}}>Количество</Text>
              <Text style={{width: 50, textAlign: 'center', fontWeight: 'bold'}}>Направление</Text>
              <Text style={{width: 50, textAlign: 'center', fontWeight: 'bold'}}>Цена</Text>
              <Text style={{width: 60, textAlign: 'center', fontWeight: 'bold'}}>Валюта</Text>
            </View>            
            <FlatList
              

              data={this.state.trades}              
              
              renderItem={this.renderRow.bind(this)}
            />
          </View>
        )   
      }
  }
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
