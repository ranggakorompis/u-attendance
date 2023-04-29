// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCccspIXKivyEeOx51oxDijgW6LcG0ee2s",
  authDomain: "u-attendance-6869e.firebaseapp.com",
  projectId: "u-attendance-6869e",
  storageBucket: "u-attendance-6869e.appspot.com",
  messagingSenderId: "258026842998",
  appId: "1:258026842998:web:1407c2409dbf2cd10ce857",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Check user if auth
onAuthStateChanged(auth, (user) => {
  if (user) window.location = "./src/pages/account.html";
});

// Init variables
const signInForm = document.querySelector(".login-form");

// Function for login
const signInUser = () => {
  // get value from email and password
  const userEmail = signInForm["user-email"].value;
  const userPassword = signInForm["user-password"].value;

  // method for login
  signInWithEmailAndPassword(auth, userEmail, userPassword)
    .then(() => {
      signInForm.reset();
    })
    .catch(() => {
      const alertMessage = document.querySelector(".alert-message");
      alertMessage.style.display = "block";
    });
};

// call functino when from submit
signInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  signInUser();
});
