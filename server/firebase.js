const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const firebaseConfig = {
    apiKey: "AIzaSyCLuF6-b2ksMAG6Ug3K-GyqVphYvRh5rBY",
    authDomain: "scanmetest1.firebaseapp.com",
    projectId: "scanmetest1",
    storageBucket: "scanmetest1.appspot.com",
    messagingSenderId: "680167001588",
    appId: "1:680167001588:web:b9a9095a014dcfbcb73da1"
    
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

module.exports = { db };