import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// THIS IS USED TO INITIALIZE THE firebase OBJECT
// PUT YOUR FIREBASE PROJECT CONFIG STUFF HERE
var firebaseConfig = {
    apiKey: "AIzaSyCRlqKzyqsArQfxM5L0Fa6oY4dtj6USi5o",
    authDomain: "todo-hw3-b1ae5.firebaseapp.com",
    databaseURL: "https://todo-hw3-b1ae5.firebaseio.com",
    projectId: "todo-hw3-b1ae5",
    storageBucket: "todo-hw3-b1ae5.appspot.com",
    messagingSenderId: "1045247669498",
    appId: "1:1045247669498:web:88cd31986c0cbf6bac8543",
    measurementId: "G-LL63RZXGZM"
};
firebase.initializeApp(firebaseConfig);

// NOW THE firebase OBJECT CAN BE CONNECTED TO THE STORE
export default firebase;