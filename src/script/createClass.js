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
  })
    .then(() => {
      alert("Class successfully created!");
      createForm.reset();
    })
    .catch((error) => {
      alert(error);
    });
};
