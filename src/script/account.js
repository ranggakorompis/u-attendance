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
const accountAlertMessage = document.querySelector(".account-alert-message");
const okBtn = document.querySelector(".ok-btn");

// function to get data from database
const getUserData = (userId) => {
  const refDb = ref(db);
  get(child(refDb, `User/${userId}`)).then((snapshot) => {
    if (snapshot.exists()) {
      userName.innerHTML = snapshot.val().Username;
      faculty.innerHTML = snapshot.val().Faculty;
    }
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

    const classCode = classData.ClassCode;
    const className = classData.ClassName;
    const pararel = classData.Pararel;
    const startTime = classData.StartTime;
    const filterTime = startTime.substr(0, 2);
    const startMinutes = startTime.substr(3, 5);

    // assign value to the element
    subject.innerHTML = `[<span class="class-code">${classCode}</span>] ${className} - <span class="pararel-class">${pararel}</span>`;

    credits.innerHTML = `<p class="credit">Credit : ${classData.Credit}</p> \n <p class="room">${classData.Room} - ${classData.Floor}</p>`;

    schedule.innerHTML = `<p class="day">${classData.Day}</p> \n <p class="time">${classData.StartTime} - ${classData.EndTime}</p>`;

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
      removeClassMsg(id, classCode, className);
    });

    // call nfc function
    kelasInfo.addEventListener("click", (e) => {
      e.preventDefault();
      scanNfc(id, className, filterTime, startMinutes);
    });
  }
};

// create remove class message
const removeClassMsg = (userId, classCode, className) => {
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
    location.reload();
  });

  removeClassBtn.addEventListener("click", () => {
    const userRef = `User/${userId}/Classes/${classCode}`;
    const studentRef = `User/${userId}/Students/${className}`;
    remove(ref(db, userRef)).then(() => {
      remove(ref(db, studentRef)).then(() => {
        accountAlertMessage.style.transform = "translateY(0%)";
        document.documentElement.scrollTop = 0;
        removeClassMessage.style.display = "none";
        okBtn.addEventListener("click", () => {
          location.reload();
        });
      });
    });
  });
};

// function to scan absent
async function scanNfc(userId, className, startTime, startMinutes) {
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

  // scan absent with nfc
  if ("NDEFReader" in window) {
    const ndef = new NDEFReader();
    try {
      await ndef.scan();
      ndef.onreading = async (event) => {
        const decoder = new TextDecoder();
        for (const record of event.message.records) {
          const nim = decoder.decode(record.data);

          // cek data exist
          const refDb = ref(db);
          const refNIM = `User/${userId}/Students/${className}/${nim}`;
          get(child(refDb, refNIM))
            .then((snapshot) => {
              const data = snapshot.val();

              // post data absent to google sheet
              const sheetName = className;
              const endpoint = `https://sheetdb.io/api/v1/i8z42whbaabc6?sheet=${sheetName}`;
              const fullName = `${data.LastName}, ${data.FirstName}`;
              const studentNIM = data.StudentNIM;

              postAbsent(
                startTime,
                startMinutes,
                endpoint,
                fullName,
                studentNIM,
                h2,
                nfcLogo,
                p1
              );
            })
            .catch(() => {
              h2.innerHTML = "Not Ready to Scan";
              p1.innerHTML = "Data is not exits in class.";
              nfcLogo.src = "../../assets/icons/close.svg";
            });
        }
      };
    } catch (error) {
      h2.innerHTML = "Not Ready to Scan";
      p1.innerHTML = "NFC is not supported on your device.";
    }
  } else {
    h2.innerHTML = "Not Ready to Scan";
    p1.innerHTML = "NFC is not supported on your device.";
  }

  // cancel nfc scan
  cancelNfcBtn.addEventListener("click", () => {
    scanNfcContainer.classList.toggle("fade-out");
    location.reload();
  });
}

// post absent to google sheet
const postAbsent = (
  startTime,
  startMinutes,
  endpoint,
  fullName,
  studentNIM,
  h2,
  nfcLogo,
  p1
) => {
  // get current time
  const date = new Date();
  const currentHours = date.getHours();
  const currentMinutes = date.getMinutes();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const localTime = `${day}/${month}/${year}`;

  // absent status
  const presentStatus = startMinutes + 10;
  const lateStatus = presentStatus + 10;
  const present = "Present";
  const late = "Late";
  const absent = "Absent";

  // check status absent
  if (currentHours === Number(startTime)) {
    if (currentMinutes >= startMinutes && currentMinutes <= presentStatus) {
      fetch(`https://sheetdb.io/api/v1/i8z42whbaabc6/search?NIM =${studentNIM}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.length === 1) {
            fetch(
              `https://sheetdb.io/api/v1/i8z42whbaabc6/NIM /${studentNIM}`,
              {
                method: "PATCH",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  data: {
                    "Status ": present,
                    "Date ": localTime,
                  },
                }),
              }
            )
              .then((response) => response.json())
              .then(() => {
                h2.innerHTML = `Student ${present}`;
                nfcLogo.src = "../../assets/icons/done.svg";
                p1.innerHTML = `The student is ${present}`;

                setTimeout(() => {
                  h2.innerHTML = "Ready to Scan";
                  nfcLogo.src = "../../assets/icons/nfc-logo.svg";
                  p1.innerHTML = "Scan the device to the NFC tag.";
                }, 2000);
              });
          } else {
            h2.innerHTML = `Not found student`;
            nfcLogo.src = "../../assets/icons/close.svg";
            p1.innerHTML = `Student is not registered in class.`;

            setTimeout(() => {
              h2.innerHTML = "Ready to Scan";
              nfcLogo.src = "../../assets/icons/nfc-logo.svg";
              p1.innerHTML = "Scan the device to the NFC tag.";
            }, 2000);
          }
        });
    } else if (
      currentMinutes >= presentStatus &&
      currentMinutes <= lateStatus
    ) {
      fetch(`https://sheetdb.io/api/v1/i8z42whbaabc6/search?NIM =${studentNIM}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.length === 1) {
            fetch(
              `https://sheetdb.io/api/v1/i8z42whbaabc6/NIM /${studentNIM}`,
              {
                method: "PATCH",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  data: {
                    "Status ": present,
                    "Date ": localTime,
                  },
                }),
              }
            )
              .then((response) => response.json())
              .then(() => {
                h2.innerHTML = `Student ${late}`;
                nfcLogo.src = "../../assets/icons/done.svg";
                p1.innerHTML = `The student is ${late}`;

                setTimeout(() => {
                  h2.innerHTML = "Ready to Scan";
                  nfcLogo.src = "../../assets/icons/nfc-logo.svg";
                  p1.innerHTML = "Scan the device to the NFC tag.";
                }, 2000);
              });
          } else {
            h2.innerHTML = `Not found student`;
            nfcLogo.src = "../../assets/icons/close.svg";
            p1.innerHTML = `Student is not registered in class.`;

            setTimeout(() => {
              h2.innerHTML = "Ready to Scan";
              nfcLogo.src = "../../assets/icons/nfc-logo.svg";
              p1.innerHTML = "Scan the device to the NFC tag.";
            }, 2000);
          }
        });
    } else {
      fetch(`https://sheetdb.io/api/v1/i8z42whbaabc6/search?NIM =${studentNIM}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.length === 1) {
            fetch(
              `https://sheetdb.io/api/v1/i8z42whbaabc6/NIM /${studentNIM}`,
              {
                method: "PATCH",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  data: {
                    "Status ": present,
                    "Date ": localTime,
                  },
                }),
              }
            )
              .then((response) => response.json())
              .then(() => {
                h2.innerHTML = `Student ${absent}`;
                nfcLogo.src = "../../assets/icons/done.svg";
                p1.innerHTML = `The student is ${absent}`;

                setTimeout(() => {
                  h2.innerHTML = "Ready to Scan";
                  nfcLogo.src = "../../assets/icons/nfc-logo.svg";
                  p1.innerHTML = "Scan the device to the NFC tag.";
                }, 2000);
              });
          } else {
            h2.innerHTML = `Not found student`;
            nfcLogo.src = "../../assets/icons/close.svg";
            p1.innerHTML = `Student is not registered in class.`;

            setTimeout(() => {
              h2.innerHTML = "Ready to Scan";
              nfcLogo.src = "../../assets/icons/nfc-logo.svg";
              p1.innerHTML = "Scan the device to the NFC tag.";
            }, 2000);
          }
        });
    }
  } else {
    h2.innerHTML = "Not Ready to Scan";
    nfcLogo = "../../assets/icons/close.svg";
    p1.innerHTML = "Class is not ready to take attendance!";
  }
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

// nav humburger menu
const humburger = document.querySelector(".humburger-menu");
const navbar = document.querySelector(".navbar");
humburger.addEventListener("click", () => {
  navbar.classList.toggle("fade-in");
});
