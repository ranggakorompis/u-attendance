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

// get class data from firebase
const getClassData = (userId) => {
  const refDb = ref(db);
  get(child(refDb, `User/${userId}/Classes`)).then((snapshot) => {
    const data = snapshot.val();
    renderClass(data, userId);
  });
};

// function to render class in html
const renderClass = (data, id) => {
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

    const classCode = classData.Classcode;
    const className = classData.Classname;
    const pararel = classData.Pararel;

    // assign value to the element
    subject.innerHTML = `[<span class="class-code">${classCode}</span>] ${className} - <span class="pararel-class">${pararel}</span>`;

    credits.innerHTML = `<p class="credit">Credit : ${classData.Credit}</p> \n <p class="room">${classData.Room}</p>`;

    schedule.innerHTML = `<p class="day">${classData.Day}</p> \n <p class="time">${classData.Classtime}</p>`;

    // append element
    classes.appendChild(kelas);
    kelas.appendChild(kelasInfo);
    kelas.appendChild(removeBtn);
    kelasInfo.appendChild(subject);
    kelasInfo.appendChild(credits);
    kelasInfo.appendChild(schedule);

    // remove class function
    removeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      removeClassMsg(id, classCode);
    });

    // call nfc function
    kelasInfo.addEventListener("click", (e) => {
      e.preventDefault();
      scanNfc();
    });
  }
};

// create remove class message
const removeClassMsg = (userId, classCode) => {
  const removeClassMessage = document.querySelector(".remove-class-message");
  const p1 = document.createElement("p");
  p1.innerHTML = "Delete Class";
  const p2 = document.createElement("p");
  p2.innerHTML = "Are you sure to delete this class?";
  const cancelClassBtn = document.createElement("button");
  cancelClassBtn.innerHTML = "Cancel";
  const removeClassBtn = document.createElement("button");
  removeClassBtn.innerHTML = "Delete";

  removeClassMessage.appendChild(p1);
  removeClassMessage.appendChild(p2);
  removeClassMessage.appendChild(cancelClassBtn);
  removeClassMessage.appendChild(removeClassBtn);

  removeClassMessage.style.display = "block";

  cancelClassBtn.addEventListener("click", () => {
    removeClassMessage.style.display = "none";
  });

  removeClassBtn.addEventListener("click", () => {
    const userRef = `User/${userId}/Classes/${classCode}`;
    remove(ref(db, userRef))
      .then(() => {
        alert("Class successfully deleted!");
        location.reload();
      })
      .catch((error) => {
        alert(error);
      });
  });
};

// NFC features
async function scanNfc() {
  if ("NDEFReader" in window) {
    // create nfc container
    const scanNfcContainer = document.querySelector(".scan-nfc");
    const h2 = document.createElement("h2");
    h2.innerHTML = "Ready to Scan";
    const nfcIcon = document.createElement("div");
    nfcIcon.className = "nfc-icon";
    const nfcLogo = document.createElement("img");
    nfcLogo.src = "../../assets/icons/nfc-logo.svg";
    const p1 = document.createElement("p");
    p1.innerHTML = "Scan the device to the NFC tag.";
    const cancelNfcBtn = document.createElement("button");
    cancelNfcBtn.innerHTML = "Cancel";
    cancelNfcBtn.className = "cancel-nfc-scan";

    // append elements to the container
    scanNfcContainer.appendChild(h2);
    scanNfcContainer.appendChild(nfcIcon);
    nfcIcon.appendChild(nfcLogo);
    scanNfcContainer.appendChild(p1);
    scanNfcContainer.appendChild(cancelNfcBtn);

    scanNfcContainer.classList.toggle("fade-in");

    // test nfc
    const ndef = new NDEFReader();
    try {
      await ndef.scan();
      ndef.onreading = async (event) => {
        const decoder = new TextDecoder();
        for (const record of event.message.records) {
          alert("data : " + decoder.decode(record.data));
        }
      };
    } catch (error) {
      alert("Gagal scan NFC tag!");
    }

    // cancel nfc scan
    cancelNfcBtn.addEventListener("click", () => {
      scanNfcContainer.classList.toggle("fade-out");
    });
  } else {
    alert("NFC not supported!");
  }
}

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
