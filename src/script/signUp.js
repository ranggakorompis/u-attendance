// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";
import {
  getDatabase,
  set,
  ref,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-database.js";

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
const db = getDatabase();

// Init Variables
const signUpForm = document.querySelector(".sign-up");

// function sign up for user
const userSignUp = () => {
  // get value form
  const userName = signUpForm["user-name"].value;
  const userEmail = signUpForm["user-email"].value;
  const userPassword = signUpForm["user-password"].value;
  const faculty = signUpForm["faculty"].value;
  const alertMessage = document.querySelector(".alert-message");

  // method signup user
  createUserWithEmailAndPassword(auth, userEmail, userPassword)
    .then((userCred) => {
      // get user id
      const userId = userCred.user.uid;

      // set data to database
      const userRef = ref(db, `User/${userId}`);
      set(userRef, {
        Username: userName,
        Faculty: faculty,
        Email: userEmail,
        Password: userPassword,
      }).then(() => {
        alertMessage.style.display = "block";
        setTimeout(() => {
          alertMessage.style.display = "none";
        }, 5000);
        signUpForm.reset();
        window.location = "account.html";
      });
    })
    .catch(() => {
      alertMessage.innerHTML = "account already signup!";
      alertMessage.style.background = "rgba(255,0,0,.7)";
      alertMessage.style.display = "block";
      setTimeout(() => {
        alertMessage.style.display = "none";
      }, 5000);
      signUpForm.reset();
    });
};

// call function when from submit
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  userSignUp();
});
