

  import firebase from 'firebase'
  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyB9EPNiClhK6MA7--0pyjqQe38qAv8weEU",
    authDomain: "instagram-clone-515b2.firebaseapp.com",
    databaseURL: "https://instagram-clone-515b2.firebaseio.com",
    projectId: "instagram-clone-515b2",
    storageBucket: "instagram-clone-515b2.appspot.com",
    messagingSenderId: "511024274518",
    appId: "1:511024274518:web:7bd9f3a309ecb179e0eff7",
    measurementId: "G-Y3LE7JS0HB"
  }) 

  
  const db = firebaseApp.firestore()
  const auth = firebase.auth()
  const storage = firebase.storage()

  export {db, auth, storage}