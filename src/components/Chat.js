import React, {Component} from 'react';
import ReactNative from 'react-native';
import * as firebase from 'firebase';

const { View, TextInput, Button, StyleSheet } = ReactNative;
const MessageList = require('./MessageList');
const firebaseApp = require('./Firebase');

class Chat extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
  });

  constructor(props) {
    super(props);
    this.state = {
      content: ''
    }
    this.groupId = this.props.navigation.state.params.groupId;
    this.groupsRef = this.getRef().child(`messages/${this.groupId}`);
  }

  getRef() {
    return firebaseApp.database().ref();
  }

  _sendMessage() {
    const currentUser = firebaseApp.auth().currentUser;
    if(currentUser) {
      this.groupsRef.push({
        content: this.state.content,
        createAt: firebase.database.ServerValue.TIMESTAMP,
        sender_name: currentUser.displayName,
        sender_email: currentUser.email
      });
      this.setState({content: ''});
    } else {
      console.log("user not login");
    }
  }

  render() {
    return (
      <View style={styles.chatContainer}>
        <MessageList groupId={this.groupId} style={styles.messageContanier} />
        <View style={[styles.footer]}>
          <View style={styles.toolContainer}>
            <TextInput
              returnKeyType={'send'}
              style={styles.contentInput}
              onChangeText={(content) => this.setState({content})}
              value={this.state.content}
              onSubmitEditing={() => this._sendMessage()}
            />
            <View style={styles.sendButtonContainer}>
              <Button
                onPress={ () => this._sendMessage() }
                title="Send"
                color="#24CE84"
                disabled={!this.state.content}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  chatContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: 60
  },

  footer: {
    height: 60,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#eee'
  },
  toolContainer: {
    display: 'flex',
    height: 40,
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 10
  },
  contentInput: {
    flex: 4,
    height: 40,
    borderColor: '#eee',
    borderWidth: 1,
    alignItems: 'center',
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  sendButtonContainer: {
    flex: 1,
  }
});

module.exports = Chat;


