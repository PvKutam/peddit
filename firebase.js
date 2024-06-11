import firebase from "firebase/compat/app"
import "firebase/compat/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCoD4dTrwdW03fHzsziGKkUhqhq8QKRFJ8",
  authDomain: "linkedin-b5ab9.firebaseapp.com",
  projectId: "linkedin-b5ab9",
  storageBucket: "linkedin-b5ab9.appspot.com",
  messagingSenderId: "919013838766",
  appId: "1:919013838766:web:181a806238ef84f778423f"
};

// Initialize Firebase
if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export {firebase};