// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCX7u6tAmK-k-6Oq-S7DNhU74MyyfT38Uw",
  authDomain: "java-corn.firebaseapp.com",
  databaseURL: "https://java-corn-default-rtdb.firebaseio.com",
  projectId: "java-corn",
  storageBucket: "java-corn.firebasestorage.app",
  messagingSenderId: "925971536544",
  appId: "1:925971536544:web:29bc09fc96f40e7dc747c5",
  measurementId: "G-TKDER5WR36"
};

// Initialize Firebase (Compat version)
firebase.initializeApp(firebaseConfig);

// Global instances for other files to use easily
const auth = firebase.auth();
const db = firebase.firestore();
