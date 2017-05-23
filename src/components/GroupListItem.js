import React, {Component} from 'react';
import ReactNative from 'react-native';
import { StackNavigator } from 'react-navigation';

const firebaseApp = require('./Firebase');
const { View, TouchableHighlight, Text, StyleSheet } = ReactNative;

class GroupListItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lastMessage: {}
    }
  }

  getRef() {
    const { item: { _key } } = this.props;
    const recentMessagesRef = firebaseApp.database().ref(`messages/${_key}`);
    return recentMessagesRef
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  componentDidMount() {
    this.getLastMessage();
  }

  componentWillUnmount() {
    // remove the listener before the Component Unmount
    this.getRef().off();
  }

  getLastMessage() {
    const recentMessagesRef = this.getRef().limitToLast(1);
    recentMessagesRef.on('child_added', (snap) => {
      this.setState({lastMessage: snap.val()});
    });
  }

  firstLetter(text){
    if(text){
      return Array.from(text)[0].toUpperCase();
    }
  }

  render() {
    const { item: { name }, onPress } = this.props;
    const { lastMessage: { sender_email, content } } = this.state;
    const avatarBackgroundColor = {
      backgroundColor: this.getRandomColor()
    }
    return (
      <TouchableHighlight onPress={onPress}>
        <View style={styles.li}>
          <View style={[styles.avatar, avatarBackgroundColor]}>
            <Text style={styles.firstLetter}>{ this.firstLetter(name) }</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.liText}>{name}</Text>
            <Text numberOfLines={1} style={styles.lastMessage}>{ sender_email && sender_email.split("@")[0] + ': '  } {content}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  li: {
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderColor: '#eee',
    borderWidth: 1,
    paddingLeft: 16,
    paddingTop: 14,
    paddingBottom: 16,
    display: 'flex',
    flexDirection: 'row',
  },
  liText: {
    color: '#000',
    fontSize: 20,
  },
  lastMessage: {
    fontSize: 16,
    color: '#999',
    marginTop: 10
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: 'blue',
    flex: 1,
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'center',
    alignItems: 'center'
  },
  content: {
    flex: 6,
    height: 60,
    marginLeft: 10,
  },
  firstLetter: {
    position: 'absolute',
    fontSize: 20,
    flex: 1,
    backgroundColor: 'transparent',
    color: '#fff',
  }
})

module.exports = GroupListItem;
