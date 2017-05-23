/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import ReactNative from 'react-native';
const MainScreen = require('./src/components/Main');

import {
  AppRegistry
} from 'react-native';

AppRegistry.registerComponent('ReactNativeFirebaseChat', () => MainScreen);
