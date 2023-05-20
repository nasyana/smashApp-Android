/* eslint-disable strict */
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import 'firebase/functions';
// import { initializeApp } from '@react-native-firebase/app';
// import { getFirestore } from '@react-native-firebase/firestore';

// const db = getFirestore();
import { getStorage } from "firebase/storage";
import { getAuth, setPersistence,getReactNativePersistence,initializeAuth } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from "firebase/app";
import { Platform } from "react-native";
import { getFunctions,httpsCallable } from 'firebase/functions';
const persistence = getReactNativePersistence(AsyncStorage);

const config = {
  apiKey: "AIzaSyDXFHlXwRd-2QOu_p7Cq06klZKtSJKXGqU",
  authDomain: "smash-app-81ca9.firebaseapp.com",
  databaseURL: "https://smash-app-81ca9.firebaseio.com",
  projectId: "smash-app-81ca9",
  storageBucket: "smash-app-81ca9.appspot.com",
  messagingSenderId: "900778037571",
  automaticDataCollectionEnabled: true
};
class FirebaseClass {
  firestore;
  auth;
  storage;
  config;
  functions;
  callable;

  constructor() {

    this.app = initializeApp(config);
    this.auth = initializeAuth(this.app,{persistence: persistence});
    this.db = getFirestore(this.app);
    this.firestore = getFirestore(this.app);
    this.functions = getFunctions(this.app, "us-central1");
    this.callable = httpsCallable;
    this.storage = getStorage(this.app);
    this.config = config;



    setPersistence(this.auth, persistence)
    .then(() => {
      console.log("Auth persistence successfully set.");
    })
    .catch((error) => {
      console.error("Error setting auth persistence:", error);
    });


  }


  logout() {
    this.auth.signOut();
    // Clear user-specific data or state here
  }
}

const firebaseInstance = new FirebaseClass();
export default firebaseInstance;
