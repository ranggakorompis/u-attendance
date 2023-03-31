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
      })
        .then(() => {
          alert(`You're account successfully created!`);
          signUpForm.reset();
          window.location = "account.html";
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((error) => {
      console.error(error);
    });
};

// call function when from submit
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  userSignUp();
});
