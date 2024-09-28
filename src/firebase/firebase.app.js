import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCz10ccmcWl7eF1cL9YLKXBH_eFLRvQFPg",
  authDomain: "devsmessenger.firebaseapp.com",
  databaseURL: "https://devsmessenger-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "devsmessenger",
  storageBucket: "devsmessenger.appspot.com",
  messagingSenderId: "1088517075598",
  appId: "1:1088517075598:web:4365bc4d723aa71f160fdf",
  measurementId: "G-82PPPXQY25"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app }