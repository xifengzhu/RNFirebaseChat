import React, { Component } from 'react';
import { Modal, Text, View, StyleSheet, TextInput, Button, Alert } from 'react-native';
const firebaseApp = require('./Firebase');

class LoginModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      conformPassword: '',
      login: true
    };
    this.userRef = this.getUserRef();
  }

  getUserRef() {
    return firebaseApp.database().ref().child("users");;
  }

  login() {
    const { email, password } = this.state;
    firebaseApp.auth()
      .signInWithEmailAndPassword(email, password)
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        Alert.alert('错误', errorMessage,
          [
            {text: 'OK', onPress: () => console.log('OK Pressed!')},
          ]
        )
    });
  }

  register() {
    const { email, password } = this.state;
    firebaseApp.auth()
      .createUserWithEmailAndPassword(email,password)
      .then((userData) => {
        this.userRef.push({
          username: email.split("@")[0],
          email: email
        });
      })
      .catch((error) => {
        let errorMessage;
        switch (error.code) {
          case "EMAIL_TAKEN":
            errorMessage = "The new user account cannot be created because the email is already in use.";
            break;
          case "INVALID_EMAIL":
            errorMessage = "The specified email is not a valid email.";
            break;
          default:
            errorMessage = `Error creating user:" ${error}`;
        }
        Alert.alert('错误', errorMessage,
          [
            {text: 'OK', onPress: () => console.log('OK Pressed!')},
          ]
        )
      })
  }

  switchMode(mode) {
    this.setState({login: (mode === 'login')});
  }

  _renderLogin(){
    return(
      <View style={{marginTop: '45%'}}>
       <View>
         <Text style={styles.titleText}>Login</Text>
         <TextInput
           autoCapitalize={'none'}
           keyboardType={'email-address'}
           autoFocus={true}
           style={styles.textInput}
           placeholder="Please type email"
           onChangeText={(email) => this.setState({email})}
           value={this.state.email}
         />
         <TextInput
           secureTextEntry={true}
           placeholder="Please type password"
           style={styles.textInput}
           onChangeText={(password) => this.setState({password})}
           value={this.state.password}
         />
       </View>
       <View style={styles.loginButtonContainer}>
         <Button
           onPress={() => this.login()}
           title="Login"
           color="white"
           disabled={!this.state.email || !this.state.password}
         />
       </View>
       <Button
         onPress={() => this.switchMode('register')}
         title="Register"
         color="#24CE84"
       />
      </View>
    )
  }

  _renderRegister(){
    return(
      <View style={{marginTop: '45%'}}>
       <View>
         <Text style={styles.titleText}>Register</Text>
         <TextInput
           autoCapitalize={'none'}
           keyboardType={'email-address'}
           autoFocus={true}
           style={styles.textInput}
           placeholder="Please type email"
           onChangeText={(email) => this.setState({email})}
           value={this.state.email}
         />
         <TextInput
           secureTextEntry={true}
           placeholder="Please type password"
           style={styles.textInput}
           onChangeText={(password) => this.setState({password})}
           value={this.state.password}
         />
         <TextInput
           secureTextEntry={true}
           placeholder="Please conform password"
           style={styles.textInput}
           onChangeText={(conformPassword) => this.setState({conformPassword})}
           value={this.state.conformPassword}
         />
       </View>
       <View style={styles.loginButtonContainer}>
         <Button
           onPress={() => this.register()}
           title="Register"
           color="white"
           disabled={!this.state.email || !this.state.password || !this.state.conformPassword}
         />
       </View>
       <Button
         onPress={() => this.switchMode('login')}
         title="Login"
         color="#24CE84"
       />
      </View>
    )
  }

  render() {
    const { modalVisible } = this.props;
    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {alert("Modal has been closed.")}}
        >
        {
          this.state.login ? this._renderLogin() : this._renderRegister()
        }
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  titleText: {
    textAlign: 'center',
    color: '#24CE84',
    fontSize: 20,
    marginBottom: 20,
  },
  loginButtonContainer: {
    backgroundColor: '#24CE84',
    shadowColor: '#000000',
    width: '80%',
    marginLeft: '10%',
    height: 40
  },
  textInput: {
    height: 40,
    borderColor: '#eee',
    borderWidth: 1,
    width: '80%',
    marginLeft: '10%',
    alignItems: 'center',
    marginBottom: 20,
    paddingLeft: 20
  },
})

module.exports = LoginModal;
