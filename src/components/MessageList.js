/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import ReactNative from 'react-native';

import {
  ListView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const firebaseApp = require('./Firebase');
const Triangle = require('./Triangle');

class Messages extends Component {

  constructor(props) {
    super(props);
    const groupId = this.props.groupId;
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
    this.messagesRef = this.getRef().child(`messages/${groupId}`);
  }

  getRef() {
    return firebaseApp.database().ref();
  }

  listenForMessages(messagesRef) {
    const self = this;
    messagesRef.on('value', (snap) => {
      // get children as an array
      let messages = [];
      snap.forEach((child) => {
        messages.push({
          sender_username: child.val().sender_username,
          sender_email: child.val().sender_email,
          content: child.val().content,
          createdAt: child.val().createdAt,
          _key: child.key
        });
      });
      self.setState({
        dataSource: self.state.dataSource.cloneWithRows(messages)
      });
    });
  }

  componentDidMount() {
    this.listenForMessages(this.messagesRef);
  }

  _current_user() {
    const currentUser = firebaseApp.auth().currentUser;
    return currentUser;
  }

  _renderItem(item) {
    // get the StyleSheet with the item email
    let messageViewStyle, senderTextStyle, contentTextStyle,contentContanierStyle;
    const isSelf = item.sender_email === this._current_user().email;
    if(isSelf){
      senderTextStyle = styles.messageSender;
      contentContanierStyle = styles.sendContentContanier;
      contentTextStyle = styles.selfContentStyle;
      triangleStyle = styles.triangleLeft;
    } else {
      senderTextStyle = styles.messageReceiver;
      contentContanierStyle = styles.receiveContentContanier;
      contentTextStyle = styles.otherContentStyle;
      triangleStyle = styles.triangleRight;
    }
    return (
      <View style={ styles.messageContanier }>
        <Triangle style={ [triangleStyle, styles.triangle] } />
        <Text style={ senderTextStyle }>{item.sender_username || item.sender_email.split("@")[0] }</Text>
        <View style={ contentContanierStyle }>
          <Text style={contentTextStyle}>{item.content}</Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this._renderItem.bind(this)}
        enableEmptySections={true}
        onContentSizeChange={ (contentWidth, contentHeight) => {
          _scrollView.scrollToEnd({animated: true});
        }}
        ref={(scrollView) => { _scrollView = scrollView; }} />
    )
  }
}

const constants = {
  selfMessageColor: '#84fed5',
  othersMessageColor: '#fed531'
}

const styles = StyleSheet.create({

  // message Container
  messageContanier: {
    marginBottom: 20,
    marginRight: 40,
    marginLeft: 20,
    marginTop: 20,
    borderRadius: 20,
    position: 'relative'
  },

  // message user
  messageSender: {
    textAlign: 'left',
    marginLeft: 5
  },
  messageReceiver: {
    textAlign: 'right',
    marginRight: 5
  },

  // content container
  sendContentContanier: {
    backgroundColor: constants.selfMessageColor,
    padding: 15,
    borderRadius: 10,
    alignSelf:'flex-start'
  },

  receiveContentContanier: {
    backgroundColor: constants.othersMessageColor,
    padding: 15,
    borderRadius: 10,
    alignSelf:'flex-end'
  },

  // content style
  selfContentStyle: {
    textAlign: 'left',
    alignSelf:'flex-end'
  },

  otherContentStyle: {
    textAlign: 'right',
  },

  triangle: {
    position: 'absolute',
    top: 30,
    zIndex: 999,
  },

  triangleLeft: {
    left: -15,
    borderBottomColor: constants.selfMessageColor,
    transform: [
      {rotate: '-100deg'}
    ]
  },
  triangleRight: {
    right: -15,
    borderBottomColor: constants.othersMessageColor,
    transform: [
      {rotate: '100deg'}
    ]
  }
});

module.exports = Messages;

