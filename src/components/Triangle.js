import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';


class Triangle extends Component {
  render() {
    return (
      <View style={[styles.triangle, this.props.style]} />
    )
  }
}

const styles = StyleSheet.create({
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'red'
  }
})

module.exports = Triangle;
