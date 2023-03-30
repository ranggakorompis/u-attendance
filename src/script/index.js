// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDvurrrDOnEc4OnT4o-P39b_7BYB0Z5MnY",
  authDomain: "u-attedance.firebaseapp.com",
  databaseURL: "https://u-attedance-default-rtdb.firebaseio.com",
  projectId: "u-attedance",
  storageBucket: "u-attedance.appspot.com",
  messagingSenderId: "461405246415",
  appId: "1:461405246415:web:814ea933e55e8de96338ba",
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
      alert("Successfully login!");
      signInForm.reset();
    })
    .catch((error) => {
      console.error(error);
    });
};

// call functino when from submit
signInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  signInUser();
});
