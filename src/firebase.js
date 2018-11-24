// import * as firebase from 'firebase';
import firebase from 'firebase/app';
import 'firebase/database';

let database;

var config = {
  apiKey: "AIzaSyC_lkSA7KYfSpRwS5YBhCjSOUQBj7wtPfs",
  authDomain: "todo-95cdd.firebaseapp.com",
  databaseURL: "https://todo-95cdd.firebaseio.com",
  projectId: "todo-95cdd",
  storageBucket: "todo-95cdd.appspot.com",
  messagingSenderId: "615804183752"
};
export const firebaseInit = () => {
  firebase.initializeApp(config);
  database = firebase.database();
}
export const firebaseGet = () => {
  return database.ref('/').once("value");
}
export const firebaseSet = (data) => {
  return database.ref('/').set(data);
}