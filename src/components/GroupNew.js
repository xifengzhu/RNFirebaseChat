/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import ReactNative from 'react-native';
import * as firebase from 'firebase';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
} from 'react-native';

const firebaseApp = require('./Firebase');

class GroupNew extends Component {

  static navigationOptions = {
    title: 'Group List',
  };

  constructor(props) {
    super(props);
    this.state = {
      group: ''
    };
    this.groupsRef = this.getRef().child('groups');
  }

  getRef() {
    return firebaseApp.database().ref();
  }

  createGroup() {
    const currentUser = firebaseApp.auth().currentUser;
    this.groupsRef.push({
      name: this.state.group,
      createAt: firebase.database.ServerValue.TIMESTAMP,
      owner: currentUser.email
    });
    this.setState({group: ''});
  }

  render() {
    return (
      <View style={ styles.inputContanier }>
        <TextInput
          autoCapitalize={'none'}
          placeholder="Create New Group"
          style={ styles.textInput }
          onChangeText={(group) => this.setState({group})}
          value={this.state.group}
          onSubmitEditing={() => this.createGroup()}
        />
        <View style={ styles.button }>
          <Button
            onPress={() => this.createGroup()}
            title="Create"
            color='#24CE84'
            disabled={!this.state.group}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
    marginLeft: 20,
    paddingLeft: 20,
    height: 40,
    marginTop: 10
  },
  button: {
    flex: 1,
    marginTop: 10,
  }
})


module.exports = GroupNew;

