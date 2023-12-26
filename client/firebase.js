// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-4591c.firebaseapp.com",
  projectId: "mern-estate-4591c",
  storageBucket: "mern-estate-4591c.appspot.com",
  messagingSenderId: "1014679113709",
  appId: "1:1014679113709:web:52739339f805bb821421e4",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
