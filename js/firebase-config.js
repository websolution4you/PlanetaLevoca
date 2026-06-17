// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBypmrH3WmW6xLb1Jo1szqP5SgIM0kZ2qM",
  authDomain: "planetalevoca-info.firebaseapp.com",
  projectId: "planetalevoca-info",
  storageBucket: "planetalevoca-info.firebasestorage.app",
  messagingSenderId: "809971987590",
  appId: "1:809971987590:web:8608ef414f3a4d590ecd07"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = firebase.auth();

// Initialize Firebase Firestore
const db = firebase.firestore();

