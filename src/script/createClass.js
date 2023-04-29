// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
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

// check who is login
onAuthStateChanged(auth, (user) => {
  if (user) {
    const id = user.uid;
    createForm.addEventListener("submit", (e) => {
      e.preventDefault();
      createClass(id);
    });
  }
});

// init variables
const createForm = document.querySelector(".create-class-form");

// function to create class
const createClass = (userId) => {
  // get value from user
  const className = createForm["class-name"].value;
  const pararel = createForm["class-pararel"].value;
  const classCode = createForm["class-code"].value;
  const credit = createForm["credit"].value;
  const room = createForm["room"].value;
  const floor = createForm["floor"].value;
  const day = createForm["day"].value;
  const startTime = createForm["start-time"].value;
  const endTime = createForm["end-time"].value;

  //   create class data to the firebase
  const userRef = ref(db, `User/${userId}/Classes/${classCode}`);
  set(userRef, {
    ClassName: className,
    Pararel: pararel,
    ClassCode: classCode,
    Credit: credit,
    Room: room,
    Floor: floor,
    Day: day,
    StartTime: startTime,
    EndTime: endTime,
  }).then(() => {
    const createClassMessage = document.querySelector(".create-class-message");
    const okButton = document.querySelector(".ok-button");
    createClassMessage.style.transform = "translateY(0%)";
    okButton.addEventListener("click", () => {
      location.reload();
    });
  });
};
