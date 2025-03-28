// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwngWOhnoOFrKs4EMWE3lLZ0Be1RcFgLE",
  authDomain: "farman-pharma.firebaseapp.com",
  projectId: "farman-pharma",
  storageBucket: "farman-pharma.firebasestorage.app",
  messagingSenderId: "1031796135669",
  appId: "1:1031796135669:web:becb4a3c599447bc6617bc",
  measurementId: "G-9FW9C1FWS4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);