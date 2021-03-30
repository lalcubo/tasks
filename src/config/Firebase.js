import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyDvaQNYiyrGkAPYq01pAAhqx8zhlHP9tyU",
    authDomain: "task-604ab.firebaseapp.com",
    projectId: "task-604ab",
    storageBucket: "task-604ab.appspot.com",
    messagingSenderId: "385199774523",
    appId: "1:385199774523:web:e941591d82676f5ee3b51e"  
};

var fireDB = firebase.initializeApp(firebaseConfig);

export default fireDB.database().ref();
