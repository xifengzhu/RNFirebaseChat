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
  View,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import * as firebase from 'firebase';

const GroupListItem = require('./GroupListItem');
const AccountModal = require('./AccountModal');
const GroupNew = require('./GroupNew');
const firebaseApp = require('./Firebase');
const Chat = require('./Chat');

class Main extends Component {

  static navigationOptions = {
    title: 'Group List',
  };

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      modalVisible: false,
      email: null,
      password: null,
      group: ''
    };
    this.groupsRef = this.getRef().child('groups');
  }

  getRef() {
    return firebaseApp.database().ref();
  }

  createGroup() {
    this.groupsRef.push({
      name: this.state.group,
      createAt: firebase.database.ServerValue.TIMESTAMP
    });
    this.setState({group: ''});
  }

  listenForGroups(groupsRef) {
    groupsRef.on('value', (snap) => {
      // get children as an array
      var groups = [];
      snap.forEach((child) => {
        groups.push({
          name: child.val().name,
          _key: child.key
        });
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(groups)
      });
    });
  }

  componentDidMount() {
    const self  = this;
    // For test logout
    // firebaseApp.auth().signOut().then(function() {
    //   // Sign-out successful.
    // }, function(error) {
    //   // An error happened.
    // });
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        self.listenForGroups(this.groupsRef);
        self.setState({modalVisible: false});
      } else {
        self.setState({modalVisible: true});
      }
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <GroupNew />
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderItem.bind(this)}
            enableEmptySections={true}
            style={styles.listview}/>
        <AccountModal modalVisible={this.state.modalVisible} />
      </View>
    )
  }

  _renderItem(item) {
    const onPress = () => {
      const { navigate } = this.props.navigation;
      navigate('Chat', {groupId: item._key, title: item.name});
    }
    return (
      <View>
        <GroupListItem item={item} onPress= {onPress} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    flex: 1,
    marginTop: -20
  },
  listview: {
    flex: 1,
  },
  inputContanier: {
    marginTop: 20,
    display: 'flex',
    height: 60,
    flexDirection: 'row',
  },
  textInput: {
    flex: 3,
    backgroundColor: '#fff',
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 10,
    paddingLeft: 10,
    height: 40,
    marginTop: 10
  },
  button: {
    flex: 1,
    marginTop: 10,
  }
})


const MainScreen = StackNavigator({
  Home: { screen: Main },
  AccountModal: { screen: AccountModal },
  Chat: { screen: Chat },
});

module.exports = MainScreen;

