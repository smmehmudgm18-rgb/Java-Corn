// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
