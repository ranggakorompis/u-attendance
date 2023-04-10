// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";
import {
  getDatabase,
  get,
  ref,
  child,
  set,
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

// get user id
onAuthStateChanged(auth, (user) => {
  if (user) {
    const id = user.uid;
    getClassData(id);
    addStudent(id);
  }
});

// get class data from firebase
const getClassData = (userId) => {
  const refDb = ref(db);
  get(child(refDb, `User/${userId}/Classes`)).then((snapshot) => {
    const data = snapshot.val();
    renderClass(data);
  });
};

// function to render class data
const renderClass = (data) => {
  // get class container
  const classes = document.querySelector("#class");

  for (const key in data) {
    const classData = data[key];

    const option = document.createElement("option");
    const optionValue = classData.ClassName;
    option.value = optionValue;
    option.innerHTML = optionValue;

    classes.appendChild(option);
  }
};

// function to add student
const addStudent = (userId) => {
  const addStudentForm = document.querySelector(".add-student-form");
  const addStudentBtn = document.querySelector(".add-student-btn");

  addStudentBtn.addEventListener("click", () => {
    const writeNfc = document.querySelector(".write-nfc");
    const h2 = document.createElement("h2");
    h2.innerHTML = "Ready to Add";
    const nfcIcon = document.createElement("div");
    nfcIcon.className = "nfc-icon";
    const nfcLogo = document.createElement("img");
    nfcLogo.src = "../../assets/icons/nfc-logo.svg";
    const p1 = document.createElement("p");
    p1.innerHTML = "Scan the tag to add student.";
    const cancelNfcBtn = document.createElement("button");
    cancelNfcBtn.innerHTML = "Cancel";
    cancelNfcBtn.className = "cancel-nfc-scan";

    writeNfc.appendChild(h2);
    writeNfc.appendChild(nfcIcon);
    nfcIcon.appendChild(nfcLogo);
    writeNfc.appendChild(p1);
    writeNfc.appendChild(cancelNfcBtn);

    writeNfc.classList.toggle("fade-in");

    // add & write student
    if ("NDEFReader" in window) {
      const ndef = new NDEFReader();
      const studentNIM = addStudentForm["student-nim"].value;
      ndef
        .write(studentNIM)
        .then(() => {
          // get form value
          const className = addStudentForm["class"].value;
          const studentName = addStudentForm["student-name"].value;

          const classRef = ref(
            db,
            `User/${userId}/Students/${className}/${studentNIM}`
          );
          set(classRef, {
            StudentName: studentName,
            StudentNIM: studentNIM,
          })
            .then(() => {
              alert("Student successfully added!");
              h2.innerHTML = "Successfully Added";
              p1.innerHTML = "Student successfully added.";
              nfcLogo.src = "../../assets/icons/done.svg";
              addStudentForm.reset();
            })
            .catch((error) => {
              alert(error);
            });
        })
        .catch((error) => {
          alert(error);
          h2.innerHTML = "Not Ready to Add";
          p1.innerHTML = "NFC is not supported on your device.";
          nfcLogo.src = "../../assets/icons/close.svg";
        });
    } else {
      alert("NFC not supported on your device.");
      h2.innerHTML = "Not Ready to Add";
      p1.innerHTML = "NFC is not supported on your device.";
      nfcLogo.src = "../../assets/icons/close.svg";
    }

    // cancel nfc scan
    cancelNfcBtn.addEventListener("click", () => {
      writeNfc.classList.toggle("fade-out");
      location.reload();
    });
  });
};
