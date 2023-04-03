import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import {
  getDatabase,
  get,
  ref,
  child,
  remove,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

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

// get user id
onAuthStateChanged(auth, (user) => {
  if (user) {
    const id = user.uid;
    getUserData(id);
    getClassData(id);
  }
});

// init variables
const userName = document.querySelector(".user-name");
const faculty = document.querySelector(".user-faculty");

// function to get data from database
const getUserData = (userId) => {
  const refDb = ref(db);
  get(child(refDb, `User/${userId}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        userName.innerHTML = snapshot.val().Username;
        faculty.innerHTML = snapshot.val().Faculty;
      } else {
        alert("Data not exists!");
      }
    })
    .catch((error) => {
      alert(error);
    });
};

// get data from firebase
const getClassData = (userId) => {
  const refDb = ref(db);
  get(child(refDb, `User/${userId}/Classes`)).then((snapshot) => {
    const data = snapshot.val();
    renderClass(data);
  });
};

// function to render class in html
const renderClass = (data) => {
  // get class container
  const classes = document.querySelector(".classes");
  classes.innerHTML = "";

  for (const key in data) {
    const classData = data[key];

    // create element class
    const kelasInfo = document.createElement("div");
    kelasInfo.className = "class-info";

    const kelas = document.createElement("div");
    kelas.className = "class";

    const subject = document.createElement("p");
    subject.className = "subject";

    const credits = document.createElement("div");
    credits.className = "credits";

    const schedule = document.createElement("div");
    schedule.className = "schedule";

    const removeBtn = document.createElement("img");
    removeBtn.src = "../../assets/icons/remove.svg";
    removeBtn.className = "remove-btn";

    // assign value to the element
    subject.innerHTML = `[<span class="class-code">${classData.Classcode}</span>] ${classData.Classname} - <span class="pararel-class">${classData.Pararel}</span>`;

    credits.innerHTML = `<p class="credit">Credit : ${classData.Credit}</p> \n <p class="room">${classData.Room}</p>`;

    schedule.innerHTML = `<p class="day">${classData.Day}</p> \n <p class="time">${classData.Classtime}</p>`;

    // append element
    classes.appendChild(kelas);
    kelas.appendChild(kelasInfo);
    kelasInfo.appendChild(removeBtn);
    kelasInfo.appendChild(subject);
    kelasInfo.appendChild(credits);
    kelasInfo.appendChild(schedule);
  }
};

// function to remove class
const removeClass = (userId) => {
  // remove(ref(db, `User/${userId}/Classes/${}`))
};

// logout button
const logOutIcon = document.querySelector(".logout-icon");
const logOutMessage = document.querySelector(".logout-message");
const logOutBtn = document.querySelector(".logout-btn");
const cancelBtn = document.querySelector(".cancel-btn");
logOutIcon.addEventListener("click", () => {
  logOutMessage.style.display = "block";
});

logOutBtn.addEventListener("click", (e) => {
  e.preventDefault();
  signOut(auth);
  window.location = "../../index.html";
});

cancelBtn.addEventListener("click", () => {
  logOutMessage.style.display = "none";
});
