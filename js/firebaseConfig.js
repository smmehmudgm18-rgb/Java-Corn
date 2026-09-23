// 🔑 Firebase Console থেকে তোমার প্রজেক্টের config এখানে বসাও
// Firebase Console → Project Settings → General → Your apps → Firebase SDK snippet → Config

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const authInstance = firebase.auth();

// 🎬 ভিডিও ক্যাটাগরি অপশন — এখানে বদলালে সব ফর্মে রিফ্লেক্ট হবে
const VIDEO_CATEGORIES = ["Short", "Movie", "Video"];
