import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyAcvncNCFBEyVVSyddVePx5R2sVwKKOdOk",
  authDomain: "react-todo-4ef0c.firebaseapp.com",
  databaseURL: "https://react-todo-4ef0c.firebaseio.com",
  projectId: "react-todo-4ef0c",
  storageBucket: "react-todo-4ef0c.appspot.com",
  messagingSenderId: "121460985687"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

module.exports = firebaseApp;
