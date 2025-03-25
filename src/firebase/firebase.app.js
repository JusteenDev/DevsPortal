import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAv58XuIlxeAXiLPn3a3_57P-gLVbizgdI",
  authDomain: "devsportals.firebaseapp.com",
  databaseURL: "https://devsportals-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "devsportals",
  storageBucket: "devsportals.firebasestorage.app",
  messagingSenderId: "1024517527766",
  appId: "1:1024517527766:web:84942b3c81ec172515d177"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app }