// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "osystem-59977.firebaseapp.com",
  projectId: "osystem-59977",
  storageBucket: "osystem-59977.appspot.com",
  messagingSenderId: "1016264996718",
  appId: "1:1016264996718:web:7948f54acfb2fae468f37f",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
