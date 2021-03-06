'use strict';


import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  WebView,
  StatusBar,
  Navigator,
  TextInput,
  TouchableWithoutFeedback,
  ListView,
  ProgressBarAndroid,
  TouchableHighlight,
  Image,
} from 'react-native';


var styles = StyleSheet.create({
  cellContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 1
  },

  cellImage: {
    height: 80,
    width: 60,
    marginRight: 8,
    resizeMode: 'contain'
  },

  cellTextContainer: {
    flex: 1,
  },

  cellTextPublished: {
    color: '#000000',
    flex: 1,
    fontSize: 10
  },
  cellTextTitle: {
    flex: 1,
    backgroundColor: '#2E6DA4',
    fontWeight: 'bold',
    color: '#FFFFFF',
    height: 40
  },

  cellTextIntroduction: {
    flex: 1,
    backgroundColor: BGWASH,
    height: 110    
  },

  mediaName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  mediaDescription: {
    fontSize: 12,
    color: '#999',
    flex: 1
  },
  mediaYear: {
    fontWeight: 'bold'
  }
});

var BGWASH = 'rgba(255,255,255,0.8)';
class TradeCell extends Component {

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

  addSpaces(nStr) {
      nStr += '';
      var x = nStr.split('.');
      var x1 = x[0];
      var x2 = x.length > 1 ? '.' + x[1] : '';
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + ' ' + '$2');
      }
      return x1 + x2;
  }

  render() {
    var security = this.searchsecs(parseInt(this.props.trade.item.security));
    if(security !== undefined){
      return (

      <View style={{flexDirection: 'row', height: 100, padding: 1}}>
        <Text style={{width: 90,}}>{this.props.trade.item.valuedate.substring(0, 10)}</Text>
        <Text style={{textAlign: 'right',  width: 90,}}>{this.addSpaces(this.props.trade.item.nominal.toString())}</Text>
        <Text style={{textAlign: 'center', width: 50,}}>{this.props.trade.item.direction}</Text>
        <Text style={{textAlign: 'right', width: 50,}}>{this.addSpaces(Math.round(this.props.trade.item.price * 100)/100.0.toString())}</Text>
        <Text style={{textAlign: 'center', width: 60,}}>{this.props.trade.item.currency}</Text>
      </View>
      );      
    } else{
      return (
        <View style={styles.cellTextContainer}>
          <Text>Unknown security {parseInt(this.props.trade.item[0])}</Text>
        </View>
      );
    }

  }
};


module.exports = TradeCell;