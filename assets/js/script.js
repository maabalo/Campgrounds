// Firebase SDK Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// YOUR FIREBASE CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyAVe2Xpm7QmWuQht9Qsk0zydRrv7Zvtqys",
  authDomain: "campground-da569.firebaseapp.com",
  projectId: "campground-da569",
  storageBucket: "campground-da569.firebasestorage.app",
  messagingSenderId: "336185176947",
  appId: "1:336185176947:web:b6e0597134a889f0604b06",
  measurementId: "G-PBDZSJ09E5"
};

// Initialize Firebase Services
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const campsCollection = collection(db, "campsites");

// Dynamic Globals
const PH_CITIES = [];
let camps = [];
let currentLocationFilter = 'PROVINCES';
const activeAmenities = new Set();
let currentImageData = ''; 
let currentUser = null;

// Track Auth State & Re-render Cards
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  const adminLoginBtn = document.getElementById('adminLoginBtn');
  const adminLogoutBtn = document.getElementById('adminLogoutBtn');
  const adminAddNewBtn = document.getElementById('adminAddNewBtn');
  
  if (user) {
    if (adminLoginBtn) adminLoginBtn.style.display = 'none';
    if (adminLogoutBtn) adminLogoutBtn.style.display = 'inline-block';
    if (adminAddNewBtn) adminAddNewBtn.style.display = 'inline-block';
  } else {
    if (adminLoginBtn) adminLoginBtn.style.display = 'inline-block';
    if (adminLogoutBtn) adminLogoutBtn.style.display = 'none';
    if (adminAddNewBtn) adminAddNewBtn.style.display = 'none';
  }

  renderCards();
});

// Event listener for Admin Add New Button
const adminAddNewBtn = document.getElementById('adminAddNewBtn');
if (adminAddNewBtn) {
  adminAddNewBtn.addEventListener('click', () => openEditorModal(null, true));
}

// Realtime Listener for Cloud Data Updates
onSnapshot(campsCollection, (snapshot) => {
  camps = snapshot.docs.map(document => ({
    id: String(document.id),
    ...document.data()
  }));
  
  renderCards();
}, (error) => {
  console.error("Firestore realtime listener error:", error);
  alert("Error connecting to database. Check console for details.");
});

// Save / Update Document to Firestore
async function saveCampToCloud(campData) {
  const docRef = doc(db, "campsites", String(campData.id));
  await setDoc(docRef, campData);
}

// Delete Document from Firestore
async function deleteCampFromCloud(id) {
  if (!id) return;
  const docRef = doc(db, "campsites", String(id));
  await deleteDoc(docRef);
}

// Pixel Icons Library
const PIXEL_ICONS = {
  trees: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M7 1h2v2H7zM6 3h4v2H6zM5 5h6v2H5zM4 7h8v2H4zM3 9h10v2H3zM7 11h2v4H7z"/></svg>`,
  restroom: `<svg class="pixel-icon" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16" xml:space="preserve"><style type="text/css">.st0{fill:#000000;}</style><g><path class="st0" d="M12.344 4.786a2.334 2.334 0 1 0 0 -4.669 2.334 2.334 0 0 0 0 4.669"/><path class="st0" d="M3.656 4.786a2.334 2.334 0 1 0 0 -4.669 2.334 2.334 0 0 0 0 4.669"/><path class="st0" d="m15.883 13.838 -3.202 -7.531a0.375 0.375 0 0 0 -0.338 -0.223 0.375 0.375 0 0 0 -0.338 0.223l-3.202 7.531a1.469 1.469 0 0 0 0.127 1.386 1.469 1.469 0 0 0 1.227 0.659h4.372a1.469 1.469 0 0 0 1.227 -0.659 1.469 1.469 0 0 0 0.127 -1.386"/><path class="st0" d="M5.842 6.081H1.47a1.469 1.469 0 0 0 -1.353 2.045l3.202 7.531a0.367 0.367 0 0 0 0.677 0l3.202 -7.531a1.469 1.469 0 0 0 -1.353 -2.045"/></g></svg>`,
  electricity: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M9 1H6v5H3l5 9V9h3z"/></svg>`,
  wifi: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M2 3h12v2H2zM4 6h8v2H4zM6 9h4v2H6zM7 12h2v2H7z"/></svg>`,
  pisoWifi: `<svg class="pixel-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>i</title><g id="Complete"><g id="signal"><g><path d="M2.5,12A9.5,9.5,0,1,1,12,21.5" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path d="M7.5,12A4.5,4.5,0,1,1,12,16.5" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></g></g></g></svg>`,
  signal: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M1 12h2v3H1zM5 9h2v6H5zM9 6h2v9H9zM13 2h2v13h-2z"/></svg>`,
  parking: `<svg class="pixel-icon" viewBox="0 0 15 15" version="1.1" id="parking" xmlns="http://www.w3.org/2000/svg"><path d="M11.85,8.37c-0.9532,0.7086-2.1239,1.0623-3.31,1H5.79V14H3V1h5.72c1.1305-0.0605,2.244,0.2952,3.13,1c0.8321,0.8147,1.2543,1.9601,1.15,3.12C13.1271,6.3214,12.7045,7.5159,11.85,8.37z M9.75,3.7C9.3254,3.3892,8.8052,3.237,8.28,3.27H5.79v3.82h2.49c0.5315,0.0326,1.056-0.1351,1.47-0.47c0.3795-0.3947,0.5693-0.9346,0.52-1.48C10.324,4.606,10.1327,4.0763,9.75,3.7z"/></svg>`,
  carCamping: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M3 5h10v3H3zM1 8h14v4H1zM3 12h3v2H3zM10 12h3v2h-3z"/></svg>`,
  motorCamping: `<svg class="pixel-icon" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 260.004 260.004" style="enable-background:new 0 0 260.004 260.004;" xml:space="preserve"><path id="XMLID_451_" d="M200.002,0h-140c-8.284,0-15,6.716-15,15c0,8.284,6.716,15,15,15h27.58c-1.665,4.695-2.58,9.742-2.58,15c0,19.555,12.541,36.228,30,42.42V110h-25c-8.284,0-15,6.716-15,15v55.017c0,8.284,6.716,15,15,15h10v49.987c0,8.284,6.716,15,15,15h30c8.284,0,15-6.716,15-15v-49.987h10c8.284,0,15-6.716,15-15V125c0-8.284-6.716-15-15-15h-25V87.42c17.459-6.192,30-22.865,30-42.42c0-5.258-0.915-10.305-2.58-15h27.58c8.284,0,15-6.716,15-15C215.002,6.716,208.286,0,200.002,0z M155.002,165.017h-10h-30h-10V140h50V165.017z M145.002,45c0,8.271-6.729,15-15,15s-15-6.729-15-15c0-8.271,6.729-15,15-15S145.002,36.729,145.002,45z"/></svg>`,
  tentOnly: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M8 2L1 14h14L8 2zm0 3.5l4 7H4l4-7z"/><path d="M7 9h2v5H7z"/></svg>`,
  hammock: `<svg class="pixel-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 60.626 60.626" style="enable-background:new 0 0 60.626 60.626;" xml:space="preserve">
  <g>
    <g>
      <path style="fill:#010002;" d="M59.601,20.867L33.927,43.31c-1.605,1.404-3.213,2.068-4.778,1.971
			c-2.286-0.145-3.798-1.882-3.812-1.898L1.066,20.46L0,21.324l24.196,22.847c0.248,0.28,2.037,2.192,4.833,2.375
			c0.143,0.01,0.285,0.016,0.429,0.016c1.863,0,3.71-0.791,5.496-2.352l25.672-22.444L59.601,20.867z"/>
      <circle style="fill:#010002;" cx="41.755" cy="18.658" r="4.594"/>
      <path style="fill:#010002;" d="M27.054,40.402c0.007,0.008,0.014,0.018,0.022,0.023c0.109,0.108,0.223,0.209,0.34,0.301
			c0.24,0.215,0.48,0.43,0.72,0.646c1.487,1.33,3.379,0.664,4.26-0.591c0.17-0.118,0.334-0.243,0.488-0.386
			c2.815-2.574,5.631-5.15,8.443-7.727c0.16-0.086,0.318-0.188,0.471-0.324c3.469-3.104,6.938-6.207,10.404-9.311
			c2.111-1.887-0.998-4.974-3.098-3.097c-2.492,2.229-4.982,4.458-7.474,6.687c-0.013-0.011-0.022-0.025-0.034-0.037
			c-1.652-1.63-4.158-1.48-5.81,0.031c-2.629,2.403-5.255,4.807-7.881,7.208c-4.991-4.468-9.982-8.936-14.972-13.403
			c-2.62-2.348-6.507,1.511-3.87,3.872C15.061,29.665,21.057,35.033,27.054,40.402z"/>
    </g>
  </g>
</svg>
`,
  forest: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M4 3h2v2H4zM3 5h4v2H3zM2 7h6v2H2zM5 9h2v3H5zM10 1h2v2h-2zM9 3h4v2H9zM8 5h6v2H8zM7 7h8v2H7zM11 9h2v4h-2z"/></svg>`,
  mountain: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M8 2l5 10H3l5-10zm0 3L6 9h4L8 5z"/></svg>`,
  river: `<svg class="pixel-icon" viewBox="0 0 1024 1024" fill="#000000" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M808.728649 847.058316a128.534411 128.534411 0 0 1 6.619798-188.526329 211.143973 211.143973 0 0 0 10.205522-310.716768l-16.411583-16.135758a128.534411 128.534411 0 0 1 5.654411-188.52633L979.188447 0.137912h-126.051987l-92.677172 80.678788a211.281886 211.281886 0 0 0-9.240134 310.027206l16.411582 16.135757a128.396498 128.396498 0 0 1-6.20606 188.940068 211.143973 211.143973 0 0 0-10.895084 310.027205l119.018451 118.053064h117.087676z m-688.183165-95.711245a127.155286 127.155286 0 0 1 44.545724-92.815084 211.143973 211.143973 0 0 0 10.205522-310.716768l-16.411583-16.135758a128.534411 128.534411 0 0 1 5.654411-188.52633L328.931208 0.137912h-126.051987L110.202049 80.8167a211.281886 211.281886 0 0 0-9.240134 310.027206l16.411582 16.135757a128.396498 128.396498 0 0 1-6.20606 188.940068 211.143973 211.143973 0 0 0-10.895085 310.027205l119.018452 118.053064h117.087676L158.333497 847.472054a127.155286 127.155286 0 0 1-37.788013-96.124983zM292.660231 505.311246a209.213199 209.213199 0 0 1-3.585724 31.168215L639.785888 185.768081a211.695623 211.695623 0 0 1 65.232592-104.951381L797.695652 0.137912h-70.335353L285.212959 442.836902a210.592323 210.592323 0 0 1 7.447272 62.474344zM475.394238 0h-92.815084l-41.373738 35.443502-159.564713 159.564713a128.672323 128.672323 0 0 0 2.206599 95.297509zM229.496326 347.815219a210.178586 210.178586 0 0 1 32.133602 41.373737L650.405147 0.55165H552.901039L217.084204 335.265185z m405.048888-79.437576L178.468716 724.454141a130.603098 130.603098 0 0 0-3.723636 26.89293 127.431111 127.431111 0 0 0 13.791246 61.233131l469.867744-470.833131a211.971448 211.971448 0 0 1-23.720943-73.369428z m1.1033 524.06734L404.23141 1023.862088h97.504107l160.530101-160.530101a212.10936 212.10936 0 0 1-26.479191-70.887004z m148.393805 201.765926l-29.099529 29.651179h59.578182z m-71.990303-587.369158l-16.411583-16.411583c-1.379125-1.379125-2.620337-2.896162-3.999461-4.275286L221.91114 855.884714l48.958923 48.545185 465.316633-465.316633a129.086061 129.086061 0 0 0-24.13468-32.271515z m-132.671785 617.020337h97.504108l68.956229-68.956229-48.958923-48.545186z m-220.659932-31.995691L637.027639 713.559057a211.695623 211.695623 0 0 1 68.956229-117.777239 127.017374 127.017374 0 0 0 44.545724-93.090909L309.899288 943.321212z"/></svg>`,
  beach: `<svg class="pixel-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill="#000000" d="M10 5.196c1.5-2.598 5.098-2.83 7.696-1.33s4.196 4.732 2.696 7.33l-3.464-2-1.732-1-1.732-1-3.464-2z"/><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.696 3.866C15.098 2.366 11.5 2.598 10 5.196l3.464 2m4.232-3.33c2.598 1.5 4.196 4.732 2.696 7.33l-5.196-3m2.5-4.33.5-.866m-.5.866c-1.821.488-2.982 1.165-4.232 3.33m4.232-3.33c.488 1.821.482 3.165-.768 5.33m-1.732-1-1.732-1m1.732 1-3 5.196M3 21l.88-1.056a2.001 2.001 0 0 1 3.139.08v0a2.001 2.001 0 0 0 3.107.118l.19-.218a2.236 2.236 0 0 1 3.367 0l.191.218c.838.957 2.344.9 3.107-.117v0a2.001 2.001 0 0 1 3.14-.08L21 21M6.708 16A7.97 7.97 0 0 1 12 14a7.97 7.97 0 0 1 5.292 16"/></svg>`,
  hiking: `<svg class="pixel-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 22V16L12 14M12 14L13 8M12 14H10M13 8C14 9.16667 15.6 11 18 11M13 8L12.8212 7.82124C12.2565 7.25648 11.2902 7.54905 11.1336 8.33223L10 14M10 14L8 22M18 9.5V22M8 7H7.72076C7.29033 7 6.90819 7.27543 6.77208 7.68377L5.5 11.5L7 12L8 7ZM14.5 3.5C14.5 4.05228 14.0523 4.5 13.5 4.5C12.9477 4.5 12.5 4.05228 12.5 3.5C12.5 2.94772 12.9477 2.5 13.5 2.5C14.0523 2.5 14.5 2.94772 14.5 3.5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  trail: `<svg class="pixel-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 399.888 399.888" style="enable-background:new 0 0 399.888 399.888;" xml:space="preserve"><g><path d="M322.833,381.871c-0.258-0.005-26.109-0.57-53.849-7.807c-24.776-6.463-56.088-19.696-64.552-46.03c-15.083-46.925,34.861-113.407,74.992-166.826c30.772-40.96,55.077-73.313,53.277-95.816c-1.101-13.765-12.274-26.923-33.208-39.109C283.924,17.22,262.719,8.47,236.467,0.274c-3.164-0.987-6.528,0.776-7.516,3.939c-0.987,3.163,0.776,6.528,3.939,7.515c74.494,23.257,87.015,44.204,87.848,54.62c1.438,17.972-23.989,51.819-50.909,87.652c-43.97,58.529-93.806,124.867-76.822,177.705c19.092,59.399,125.096,62.078,129.599,62.163c0.039,0,0.077,0.001,0.115,0.001c3.261,0,5.935-2.612,5.997-5.887C328.782,384.67,326.146,381.933,322.833,381.871z"/><path d="M244.412,89.767c4.036-12.106,2.866-23.767-3.476-34.656C219.323,17.997,143.113,2.62,139.879,1.983c-3.25-0.642-6.406,1.477-7.046,4.728c-0.64,3.251,1.477,6.406,4.729,7.046c0.187,0.037,18.888,3.761,39.875,11.66c27.08,10.192,45.453,22.548,53.131,35.733c4.594,7.889,5.399,16.009,2.461,24.823c-4.137,12.41-31.346,35.429-60.153,59.799c-31.966,27.042-68.196,57.692-94.246,89.904c-31.357,38.775-41,71.624-29.48,100.423c10.19,25.477,26.378,45.971,49.486,62.653c1.063,0.767,2.29,1.136,3.507,1.136c1.861,0,3.697-0.864,4.87-2.489c1.939-2.687,1.334-6.437-1.353-8.376c-21.208-15.311-36.049-34.08-45.369-57.381c-22.388-55.97,60.103-125.754,120.334-176.709C213.357,127.242,239.211,105.37,244.412,89.767z"/><path d="M90.915,128.189c-2.083,2.578-1.682,6.355,0.895,8.438c2.577,2.083,6.354,1.682,8.438-0.895L111,122.428v28.273c0,3.313,2.686,6,6,6s6-2.687,6-6v-28.273l10.752,13.304c1.186,1.467,2.92,2.229,4.67,2.229c1.324,0,2.657-0.436,3.768-1.333c2.577-2.083,2.978-5.86,0.895-8.438L123,103.336V92.081l10.752,13.305c1.186,1.467,2.92,2.229,4.67,2.229c1.324,0,2.657-0.436,3.768-1.333c2.577-2.083,2.978-5.86,0.895-8.438L123,72.99V61.734l10.752,13.304c1.186,1.467,2.92,2.229,4.67,2.229c1.324,0,2.657-0.437,3.768-1.333c2.577-2.083,2.978-5.861,0.895-8.438l-21.418-26.503c-1.139-1.41-2.854-2.229-4.667-2.229c-1.813,0-3.527,0.819-4.667,2.229L90.915,67.496c-2.083,2.577-1.682,6.355,0.895,8.438c2.577,2.082,6.354,1.682,8.438-0.896L111,61.734V72.99L90.915,97.843c-2.083,2.578-1.682,6.355,0.895,8.438c2.577,2.083,6.354,1.682,8.438-0.895L111,92.081v11.255L90.915,128.189z"/><path d="M344.764,260.612c1.186,1.467,2.92,2.229,4.67,2.229c1.324,0,2.657-0.436,3.768-1.333c2.577-2.083,2.978-5.86,0.895-8.438L323,214.591v-26.857l21.763,26.929c1.186,1.467,2.92,2.229,4.67,2.229c1.324,0,2.657-0.436,3.768-1.333c2.577-2.083,2.978-5.86,0.895-8.438l-32.43-40.128c-1.139-1.409-2.854-2.229-4.667-2.229c-1.813,0-3.527,0.819-4.667,2.229l-32.43,40.128c-2.083,2.578-1.682,6.355,0.895,8.438c2.577,2.083,6.354,1.682,8.438-0.895L311,187.735v26.857l-31.096,38.478c-2.083,2.578-1.682,6.355,0.895,8.438c2.577,2.083,6.354,1.682,8.438-0.895L311,233.683v26.857l-31.096,38.478c-2.083,2.578-1.682,6.355,0.895,8.438c2.577,2.083,6.354,1.682,8.438-0.895L311,279.631v51.57c0,3.313,2.687,6,6,6s6-2.687,6-6v-51.57l21.763,26.929c1.186,1.467,2.92,2.229,4.67,2.229c1.324,0,2.657-0.436,3.768-1.333c2.577-2.083,2.978-5.86,0.895-8.438L323,260.54v-26.857L344.764,260.612z"/></g></svg>`
};

const ICON_LABELS = {
  trees: 'TREES',
  restroom: 'RESTROOM',
  electricity: 'POWER',
  wifi: 'WI-FI',
  pisoWifi: 'PISO WI-FI',
  signal: 'SIGNAL',
  parking: 'PARKING',
  carCamping: 'CAR CAMP',
  motorCamping: 'MOTOR CAMP',
  tentOnly: 'TENT',
  hammock: 'HAMMOCK',
  forest: 'FOREST',
  mountain: 'MOUNTAIN',
  river: 'RIVER',
  beach: 'BEACH',
  hiking: 'HIKING',
  trail: 'TRAIL'
};

function renderLegend() {
  const legendGrid = document.getElementById('legendGrid');
  if (!legendGrid) return;
  legendGrid.innerHTML = '';

  Object.keys(PIXEL_ICONS).forEach(key => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.innerHTML = `${PIXEL_ICONS[key]} <span>${ICON_LABELS[key]}</span>`;
    legendGrid.appendChild(item);
  });
}

// Filter toggle (now in admin bar)
const filterWrapper = document.querySelector('.filter-wrapper');
const filterToggleBtn = document.getElementById('filterToggleBtn');
if (filterToggleBtn && filterWrapper) {
  filterToggleBtn.addEventListener('click', () => {
    filterWrapper.classList.toggle('open');
  });
}

// Legend toggle (now in admin bar)
const legendWrapper = document.querySelector('.legend-wrapper');
const legendToggleBtn = document.getElementById('legendToggleBtn');
if (legendToggleBtn && legendWrapper) {
  legendToggleBtn.addEventListener('click', () => {
    legendWrapper.classList.toggle('open');
  });
}

// Burger menu toggle
const burgerBtn = document.getElementById('burgerBtn');
const burgerDropdown = document.getElementById('burgerDropdown');
if (burgerBtn && burgerDropdown) {
  burgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    burgerDropdown.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!burgerDropdown.contains(e.target) && e.target !== burgerBtn) {
      burgerDropdown.classList.remove('open');
    }
  });
}

function populateLocationDropdown() {
  const dropdownMenu = document.getElementById('dropdownMenu');
  if (!dropdownMenu) return;
  dropdownMenu.innerHTML = '';

  const dynamicCities = camps.map(c => c.location ? c.location.toUpperCase() : '').filter(Boolean);
  const uniqueCities = ['PROVINCES', ...new Set([...PH_CITIES, ...dynamicCities])];

  if (!uniqueCities.includes(currentLocationFilter)) {
    currentLocationFilter = 'PROVINCES';
  }
  
  const selectedTextEl = document.getElementById('selectedOptionText');
  if (selectedTextEl) selectedTextEl.textContent = currentLocationFilter;

  uniqueCities.forEach(loc => {
    if (!loc) return;
    const item = document.createElement('div');
    item.className = `dropdown-item ${loc === currentLocationFilter ? 'selected' : ''}`;
    item.dataset.value = loc;
    item.textContent = loc;

    item.addEventListener('click', () => {
      document.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      currentLocationFilter = loc;
      if (selectedTextEl) selectedTextEl.textContent = loc;
      const customDropdown = document.getElementById('customDropdown');
      if (customDropdown) customDropdown.classList.remove('open');
      filterCards();
    });

    dropdownMenu.appendChild(item);
  });
}

const cardGrid = document.getElementById('cardGrid');

function renderCards() {
  if (!cardGrid) return;
  cardGrid.innerHTML = '';

  const visibleCamps = camps.filter(camp => {
    if (currentUser) return true; // Admins see everything
    const status = camp.status || 'approved'; 
    return status === 'approved';
  });

  visibleCamps.forEach(camp => {
    const isPending = camp.status === 'pending';
    
    const activeIcons = [];
    if (camp.trees) activeIcons.push(PIXEL_ICONS.trees);
    if (camp.restroom) activeIcons.push(PIXEL_ICONS.restroom);
    if (camp.electricity) activeIcons.push(PIXEL_ICONS.electricity);
    if (camp.wifi) activeIcons.push(PIXEL_ICONS.wifi);
    if (camp.pisoWifi) activeIcons.push(PIXEL_ICONS.pisoWifi);
    if (camp.signal) activeIcons.push(PIXEL_ICONS.signal);
    if (camp.parking) activeIcons.push(PIXEL_ICONS.parking);
    if (camp.carCamping) activeIcons.push(PIXEL_ICONS.carCamping);
    if (camp.motorCamping) activeIcons.push(PIXEL_ICONS.motorCamping);
    if (camp.tentOnly) activeIcons.push(PIXEL_ICONS.tentOnly);
    if (camp.hammock) activeIcons.push(PIXEL_ICONS.hammock);
    if (camp.forest) activeIcons.push(PIXEL_ICONS.forest);
    if (camp.mountain) activeIcons.push(PIXEL_ICONS.mountain);
    if (camp.river) activeIcons.push(PIXEL_ICONS.river);
    if (camp.beach) activeIcons.push(PIXEL_ICONS.beach);
    if (camp.hiking) activeIcons.push(PIXEL_ICONS.hiking);
    if (camp.trail) activeIcons.push(PIXEL_ICONS.trail);

    const iconsHtml = activeIcons.map(iconSvg => `<span class="card-icon-badge">${iconSvg}</span>`).join('');
    const displayLocation = [camp.locDetails, camp.location].filter(Boolean).join(', ');

    const imageContainerHtml = camp.img && camp.img.trim() !== '' 
      ? `<img src="${camp.img}" alt="${camp.name || 'Campsite'}" class="card-image">`
      : `<div class="no-image-placeholder">NO IMAGE</div>`;

    // Admin Action Controls & Status Indicator
    let adminBarHtml = '';
    if (currentUser) {
      if (isPending) {
        adminBarHtml = `
          <div class="pending-banner" style="background: #EB7D00; color: #2E2910; font-size: 0.5rem; padding: 0.3rem; text-align: center; font-weight: bold;">
            PENDING SUGGESTION
          </div>
          <div class="admin-approval-actions" style="display: flex; gap: 0.5rem; padding: 0.5rem; background: rgba(0,0,0,0.3);">
            <button class="pixel-btn approve-btn" data-id="${camp.id}" style="background-color: #2C5745; color: #EBE3A7; flex: 1; font-size: 0.5rem;">APPROVE</button>
            <button class="pixel-btn decline-btn" data-id="${camp.id}" style="background-color: #A94442; color: #FFF; flex: 1; font-size: 0.5rem;">DECLINE</button>
          </div>
        `;
      }

      adminBarHtml += `
        <div class="card-menu-container">
          <button class="card-menu-btn" title="Options">⋮</button>
          <div class="card-dropdown-menu">
            <button class="card-edit-btn" data-id="${camp.id}">EDIT</button>
          </div>
        </div>
      `;
    }

    const card = document.createElement('article');
    card.className = 'camp-card';
    card.setAttribute('data-id', camp.id);
    card.innerHTML = `
      ${adminBarHtml}
      <div class="card-image-wrapper">
        ${imageContainerHtml}
      </div>
      <div class="card-content">
        <h2 class="camp-title">${camp.name || ''}</h2>
        <div class="card-icons-row">
          ${iconsHtml}
        </div>
        <div class="card-actions">
          <span class="camp-location">${displayLocation || 'LOCATION UNKNOWN'}</span>
        </div>
      </div>
    `;

    // Event Handlers for Admin Actions
    if (currentUser) {
      const menuBtn = card.querySelector('.card-menu-btn');
      const dropdownMenu = card.querySelector('.card-dropdown-menu');

      if (menuBtn && dropdownMenu) {
        menuBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          document.querySelectorAll('.card-dropdown-menu').forEach(m => {
            if (m !== dropdownMenu) m.classList.remove('open');
          });
          dropdownMenu.classList.toggle('open');
        });
      }

      const editBtn = card.querySelector('.card-edit-btn');
      if (editBtn) {
        editBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          if (dropdownMenu) dropdownMenu.classList.remove('open');
          openEditorModal(camp);
        });
      }

      // APPROVE ACTION
      const approveBtn = card.querySelector('.approve-btn');
      if (approveBtn) {
        approveBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          e.preventDefault();
          await saveCampToCloud({ ...camp, status: 'approved' });
        });
      }

      // DECLINE ACTION
      const declineBtn = card.querySelector('.decline-btn');
      if (declineBtn) {
        declineBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          e.preventDefault();
          
          if (confirm('DECLINE AND DELETE THIS SUGGESTION?')) {
            try {
              await deleteCampFromCloud(camp.id);
            } catch (err) {
              console.error("Failed to decline suggestion:", err);
              alert("Error deleting suggestion: " + err.message);
            }
          }
        });
      }
    }

    card.addEventListener('click', (e) => {
      if (
        !e.target.closest('.card-menu-container') && 
        !e.target.closest('.admin-approval-actions')
      ) {
        openDetailModal(camp);
      }
    });

    cardGrid.appendChild(card);
  });

  populateLocationDropdown();
  filterCards();
}

document.addEventListener('click', () => {
  document.querySelectorAll('.card-dropdown-menu').forEach(m => m.classList.remove('open'));
});

// Helper functions for locking background scroll
function lockScroll() {
  document.body.classList.add('modal-open');
}

function unlockScroll() {
  document.body.classList.remove('modal-open');
}

const modalOverlay = document.getElementById('modalOverlay');

function openDetailModal(camp) {
  if (!modalOverlay) return;

  const modalImgWrapper = document.querySelector('.modal-image-wrapper');
  if (camp.img && camp.img.trim() !== '') {
    modalImgWrapper.innerHTML = `<img id="modalImg" src="${camp.img}" alt="${camp.name || 'Campsite'}" class="modal-image">`;
  } else {
    modalImgWrapper.innerHTML = `<div class="no-image-placeholder">NO IMAGE</div>`;
  }

  document.getElementById('modalTitle').textContent = camp.name || '';
  
  const displayLocation = [camp.locDetails, camp.location].filter(Boolean).join(', ');
  document.getElementById('modalLocText').textContent = displayLocation || 'LOCATION UNKNOWN';
  document.getElementById('modalDesc').textContent = camp.desc || '';

  const campUrlLink = document.getElementById('modalCampUrlLink');
  const mapLink = document.getElementById('modalMapLink');
  const visitContainer = document.getElementById('modalVisitContainer');

  let hasLinks = false;

  if (campUrlLink) {
    if (camp.campUrl && camp.campUrl.trim() !== '') {
      campUrlLink.href = camp.campUrl;
      campUrlLink.style.display = 'inline-flex';
      hasLinks = true;
    } else {
      campUrlLink.style.display = 'none';
    }
  }

  if (mapLink) {
    if (camp.mapUrl && camp.mapUrl.trim() !== '') {
      mapLink.href = camp.mapUrl;
      mapLink.style.display = 'inline-flex';
      hasLinks = true;
    } else {
      mapLink.style.display = 'none';
    }
  }

  if (visitContainer) {
    visitContainer.style.display = hasLinks ? 'block' : 'none';
  }

  const grid = document.getElementById('amenitiesGrid');
  if (grid) {
    grid.innerHTML = '';
    Object.keys(PIXEL_ICONS).forEach(key => {
      if (camp[key]) {
        grid.innerHTML += `<div class="amenity-chip">${PIXEL_ICONS[key]} ${ICON_LABELS[key]}</div>`;
      }
    });
  }

  modalOverlay.classList.add('open');
  lockScroll();
}

const modalCloseBtn = document.getElementById('modalClose');
if (modalCloseBtn && modalOverlay) {
  modalCloseBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('open');
    unlockScroll();
  });
}

/* ==================================================
   DUAL MODE IMAGE UPLOAD & CANVAS COMPRESSION
   ================================================== */
const btnUploadMode = document.getElementById('btnUploadMode');
const btnUrlMode = document.getElementById('btnUrlMode');
const fileUploadSection = document.getElementById('fileUploadSection');
const urlUploadSection = document.getElementById('urlUploadSection');

const editImgFile = document.getElementById('editImgFile');
const editImgUrl = document.getElementById('editImgUrl');
const editImgPreview = document.getElementById('editImgPreview');

if (btnUploadMode) {
  btnUploadMode.addEventListener('click', () => {
    btnUploadMode.classList.add('active');
    btnUrlMode.classList.remove('active');
    fileUploadSection.style.display = 'block';
    urlUploadSection.style.display = 'none';
    
    if (currentImageData && currentImageData.startsWith('data:image')) {
      showImagePreview(currentImageData);
    } else if (!currentImageData) {
      resetImagePreview();
    }
  });
}

if (btnUrlMode) {
  btnUrlMode.addEventListener('click', () => {
    btnUrlMode.classList.add('active');
    btnUploadMode.classList.remove('active');
    urlUploadSection.style.display = 'block';
    fileUploadSection.style.display = 'none';
    
    if (currentImageData && !currentImageData.startsWith('data:image')) {
      editImgUrl.value = currentImageData;
      showImagePreview(currentImageData);
    } else if (!editImgUrl.value) {
      resetImagePreview();
    }
  });
}

if (editImgFile) {
  editImgFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File is too large! Please choose an image under 10MB.');
      editImgFile.value = '';
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        currentImageData = canvas.toDataURL('image/jpeg', 0.7);
        showImagePreview(currentImageData);
      };
    };
  });
}

if (editImgUrl) {
  editImgUrl.addEventListener('input', (e) => {
    const url = e.target.value.trim();

    if (url.includes('facebook.com/share/')) {
      alert('Facebook webpage links cannot render directly. Switch to "UPLOAD FILE" and pick the saved image file from your device.');
      editImgUrl.value = '';
      resetImagePreview();
      return;
    }

    if (url) {
      currentImageData = url;
      showImagePreview(currentImageData);
    } else {
      resetImagePreview();
    }
  });
}

function showImagePreview(src) {
  if (editImgPreview) {
    editImgPreview.src = src;
    editImgPreview.style.display = 'inline-block';
  }
}

function resetImagePreview() {
  currentImageData = '';
  if (editImgPreview) {
    editImgPreview.src = '';
    editImgPreview.style.display = 'none';
  }
}

const editorModalOverlay = document.getElementById('editorModalOverlay');
const editorForm = document.getElementById('editorForm');

function openEditorModal(camp = null, isAdminAction = false) {
  if (!editorModalOverlay || !editorForm) return;

  const saveSubmitBtn = document.getElementById('saveSubmitBtn');

  if (camp) {
    document.getElementById('editorTitle').textContent = 'EDIT CAMPSITE';
    if (saveSubmitBtn) saveSubmitBtn.textContent = 'SAVE';
    document.getElementById('editCampId').value = String(camp.id);
    
    // Populate form fields cleanly
    document.getElementById('editName').value = camp.name || '';
    document.getElementById('editLoc').value = camp.locDetails || '';
    document.getElementById('editCampUrl').value = camp.campUrl || '';
    document.getElementById('editMapUrl').value = camp.mapUrl || '';
    document.getElementById('editCountry').value = camp.location || '';
    document.getElementById('editDesc').value = camp.desc || '';

    currentImageData = camp.img || '';
    if (currentImageData) {
      if (currentImageData.startsWith('data:image')) {
        btnUploadMode.click();
      } else {
        btnUrlMode.click();
      }
    } else {
      btnUploadMode.click();
      resetImagePreview();
    }

    document.getElementById('chkTrees').checked = !!camp.trees;
    document.getElementById('chkRestroom').checked = !!camp.restroom;
    document.getElementById('chkElectricity').checked = !!camp.electricity;
    document.getElementById('chkWifi').checked = !!camp.wifi;
    document.getElementById('chkPisoWifi').checked = !!camp.pisoWifi;
    document.getElementById('chkSignal').checked = !!camp.signal;
    document.getElementById('chkParking').checked = !!camp.parking;
    
    document.getElementById('chkCarCamping').checked = !!camp.carCamping;
    document.getElementById('chkMotorCamping').checked = !!camp.motorCamping;
    document.getElementById('chkTentOnly').checked = !!camp.tentOnly;
    document.getElementById('chkHammock').checked = !!camp.hammock;
    
    document.getElementById('chkForest').checked = !!camp.forest;
    document.getElementById('chkMountain').checked = !!camp.mountain;
    document.getElementById('chkRiver').checked = !!camp.river;
    document.getElementById('chkBeach').checked = !!camp.beach;
    document.getElementById('chkHiking').checked = !!camp.hiking;
    document.getElementById('chkTrail').checked = !!camp.trail;

    const deleteBtn = document.getElementById('deleteBtn');
    if (deleteBtn) deleteBtn.style.display = currentUser ? 'inline-block' : 'none';
  } else {
    if (currentUser || isAdminAction) {
      document.getElementById('editorTitle').textContent = 'ADD NEW SPOT';
      if (saveSubmitBtn) saveSubmitBtn.textContent = 'SAVE';
    } else {
      document.getElementById('editorTitle').textContent = 'SUGGEST A CAMPSITE';
      if (saveSubmitBtn) saveSubmitBtn.textContent = 'SUBMIT';
    }
    
    editorForm.reset();
    document.getElementById('editCampId').value = '';

    btnUploadMode.click();
    resetImagePreview();
    
    const deleteBtn = document.getElementById('deleteBtn');
    if (deleteBtn) deleteBtn.style.display = 'none';
  }
  
  editorModalOverlay.classList.add('open');
  lockScroll();
}

// Handle Form Submission
if (editorForm) {
  editorForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('saveSubmitBtn');
    const originalText = submitBtn ? submitBtn.textContent : '';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = currentUser ? 'SAVING...' : 'SUBMITTING...';
    }

    try {
      const id = document.getElementById('editCampId').value;
      const existingCamp = camps.find(c => String(c.id) === String(id));

      const campData = {
        id: id || 'camp_' + Date.now(),
        status: currentUser ? (existingCamp?.status || 'approved') : 'pending',
        name: document.getElementById('editName').value.toUpperCase(),
        locDetails: document.getElementById('editLoc').value.toUpperCase(),
        campUrl: document.getElementById('editCampUrl').value.trim(),
        mapUrl: document.getElementById('editMapUrl').value.trim(),
        location: document.getElementById('editCountry').value.toUpperCase().trim(),
        img: currentImageData || '',
        desc: document.getElementById('editDesc').value,

        trees: document.getElementById('chkTrees').checked,
        restroom: document.getElementById('chkRestroom').checked,
        electricity: document.getElementById('chkElectricity').checked,
        wifi: document.getElementById('chkWifi').checked,
        pisoWifi: document.getElementById('chkPisoWifi').checked,
        signal: document.getElementById('chkSignal').checked,
        parking: document.getElementById('chkParking').checked,
        
        carCamping: document.getElementById('chkCarCamping').checked,
        motorCamping: document.getElementById('chkMotorCamping').checked,
        tentOnly: document.getElementById('chkTentOnly').checked,
        hammock: document.getElementById('chkHammock').checked,
        
        forest: document.getElementById('chkForest').checked,
        mountain: document.getElementById('chkMountain').checked,
        river: document.getElementById('chkRiver').checked,
        beach: document.getElementById('chkBeach').checked,
        hiking: document.getElementById('chkHiking').checked,
        trail: document.getElementById('chkTrail').checked
      };

      await saveCampToCloud(campData);
      
      if (!currentUser) {
        alert('Thank you! Your campsite suggestion has been submitted for review.\n\nNOTE:If your submitted campsite is not displayed, it may mean that the page owner is currently busy or has declined the submission.');
      }

      if (editorModalOverlay) {
        editorModalOverlay.classList.remove('open');
        unlockScroll();
      }
    } catch (error) {
      console.error("Failed to save data to Firestore:", error);
      alert("Error saving campsite: " + error.message);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });
}

const suggestBtn = document.getElementById('suggestBtn');

const deleteBtn = document.getElementById('deleteBtn');
if (deleteBtn) {
  deleteBtn.addEventListener('click', async () => {
    const id = document.getElementById('editCampId').value;
    if (!id) return;
    
    if (confirm('ARE YOU SURE YOU WANT TO DELETE THIS CAMPSITE?')) {
      try {
        await deleteCampFromCloud(id);
        if (editorModalOverlay) {
          editorModalOverlay.classList.remove('open');
          unlockScroll();
        }
      } catch (error) {
        console.error("Failed to delete campsite:", error);
        alert("Error deleting campsite: " + error.message);
      }
    }
  });
}

document.querySelectorAll('.amenity-toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const amenity = btn.dataset.amenity;
    if (activeAmenities.has(amenity)) {
      activeAmenities.delete(amenity);
      btn.classList.remove('active');
    } else {
      activeAmenities.add(amenity);
      btn.classList.add('active');
    }
    filterCards();
  });
});

const searchInput = document.getElementById('searchInput');

function filterCards() {
  const query = searchInput?.value.toLowerCase().trim() || '';
  const selectedLoc = currentLocationFilter === 'ALL CITIES' ? '' : currentLocationFilter;

  const cards = cardGrid.querySelectorAll('.camp-card');
  let visibleCount = 0;

  cards.forEach((card) => {
    const cardId = card.getAttribute('data-id');
    const camp = camps.find(c => String(c.id) === String(cardId));
    if (!camp) return;

    // ✅ Search filter
    const matchesSearch = 
      (camp.name && camp.name.toLowerCase().includes(query)) ||
      (camp.locDetails && camp.locDetails.toLowerCase().includes(query));

    // ✅ Location filter
    const matchesLoc = !selectedLoc || camp.location === selectedLoc;

    // ✅ Amenity filter — ALL selected amenities must match (AND logic)
    const matchesAmenities = activeAmenities.size === 0 || 
      [...activeAmenities].every(amenity => !!camp[amenity]);

    const isVisible = matchesSearch && matchesLoc && matchesAmenities;
    card.style.display = isVisible ? 'block' : 'none';

    if (isVisible) visibleCount++;
  });

  // ✅ Show/hide "No Results" message
  const noResults = document.getElementById('noResults');
  if (noResults) {
    noResults.style.display = visibleCount === 0 ? 'block' : 'none';
  }
}

const customDropdown = document.getElementById('customDropdown');
const dropdownTrigger = document.getElementById('dropdownTrigger');
if (dropdownTrigger && customDropdown) {
  dropdownTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    customDropdown.classList.toggle('open');
  });
}

document.addEventListener('click', () => {
  if (customDropdown) customDropdown.classList.remove('open');
});

if (searchInput) {
  searchInput.addEventListener('input', filterCards);
}

const sortBtn = document.getElementById('sortBtn');
if (sortBtn) {
  sortBtn.addEventListener('click', () => {
    const isAsc = sortBtn.getAttribute('data-sort') === 'asc';
    camps.sort((a, b) => {
      const nameA = a.name || '';
      const nameB = b.name || '';
      return isAsc ? nameB.localeCompare(nameA) : nameA.localeCompare(nameB);
    });
    
    sortBtn.setAttribute('data-sort', isAsc ? 'desc' : 'asc');
    sortBtn.textContent = isAsc ? 'SORT: Z-A' : 'SORT: A-Z';
    
    renderCards();
  });
}

// Authentication Handlers
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;

    try {
      await signInWithEmailAndPassword(auth, email, pass);
      document.getElementById('loginModalOverlay').classList.remove('open');
      loginForm.reset();
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  });
}

const adminLogoutBtn = document.getElementById('adminLogoutBtn');
if (adminLogoutBtn) {
  adminLogoutBtn.addEventListener('click', async () => {
    await signOut(auth);
  });
}

// Global Event Listeners & Modal Controls
if (suggestBtn) {
  suggestBtn.addEventListener('click', () => openEditorModal(null, false));
}

// Target close buttons
const closeEditorBtn = document.getElementById('closeEditorBtn') || document.getElementById('editorModalClose');

if (closeEditorBtn) {
  closeEditorBtn.addEventListener('click', () => {
    if (editorModalOverlay) {
      editorModalOverlay.classList.remove('open');
      unlockScroll();
    }
  });
}

if (editorModalOverlay) {
  editorModalOverlay.addEventListener('click', (e) => {
    if (e.target === editorModalOverlay) {
      editorModalOverlay.classList.remove('open');
      unlockScroll();
    }
  });
}

renderLegend();
