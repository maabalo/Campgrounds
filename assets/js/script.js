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

// Initialize Firebase App and Firestore Instance
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const campsCollection = collection(db, "campsites");

let camps = [];
let currentLocationFilter = 'ALL LOCATIONS';
const activeAmenities = new Set();

// Realtime Listener for Cloud Data Updates
onSnapshot(campsCollection, (snapshot) => {
  camps = snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  }));
  
  renderCards();
}, (error) => {
  console.error("Firestore realtime listener error:", error);
  alert("Error connecting to database. Check console for details.");
});

// Save / Update Document to Firestore
async function saveCampToCloud(campData) {
  const docRef = doc(db, "campsites", campData.id);
  await setDoc(docRef, campData);
}

// Delete Document from Firestore
async function deleteCampFromCloud(id) {
  await deleteDoc(doc(db, "campsites", id));
}

// Pixel Icons Library
const PIXEL_ICONS = {
  trees: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M7 1h2v2H7zM6 3h4v2H6zM5 5h6v2H5zM4 7h8v2H4zM3 9h10v2H3zM7 11h2v4H7z"/></svg>`,
  restroom: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M2 2h5v2H2zM2 4h1v10H2zM6 4h1v10H6zM3 7h3v2H3zM10 2h4v2h-4zM11 4h2v5h-2zM9 9h6v2H9zM10 11h1v3h-1zM13 11h1v3h-1z"/></svg>`,
  electricity: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M9 1H6v5H3l5 9V9h3z"/></svg>`,
  wifi: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M2 3h12v2H2zM4 6h8v2H4zM6 9h4v2H6zM7 12h2v2H7z"/></svg>`,
  pisoWifi: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M6 1h4v2H6zM4 3h8v2H4zM3 5h10v6H3zM4 11h8v2H4zM6 13h4v2H6zM7 6h2v4H7z"/></svg>`,
  signal: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M1 12h2v3H1zM5 9h2v6H5zM9 6h2v9H9zM13 2h2v13h-2z"/></svg>`,
  parking: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M3 2h6v2H3zM3 4h2v10H3zM5 4h5v4H5z"/></svg>`,
  carCamping: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M3 5h10v3H3zM1 8h14v4H1zM3 12h3v2H3zM10 12h3v2h-3z"/></svg>`,
  motorCamping: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M10 4h3v2h-3zM2 8h4v2H2zM10 8h4v2h-4zM2 10h4v4H2zM10 10h4v4h-4zM6 9h4v2H6z"/></svg>`,
  tentOnly: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M8 2L1 14h14L8 2zm0 3.5l4 7H4l4-7z"/><path d="M7 9h2v5H7z"/></svg>`,
  forest: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M4 3h2v2H4zM3 5h4v2H3zM2 7h6v2H2zM5 9h2v3H5zM10 1h2v2h-2zM9 3h4v2H9zM8 5h6v2H8zM7 7h8v2H7zM11 9h2v4h-2z"/></svg>`,
  mountain: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M8 2l5 10H3l5-10zm0 3L6 9h4L8 5z"/></svg>`,
  river: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M1 3h7v2H1zM8 7h7v2H8zM1 11h7v2H1z"/></svg>`,
  beach: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M8 2h2v2H8zM6 4h6v2H6zM8 6h2v8H8zM2 13h12v2H2z"/></svg>`,
  hiking: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M7 1h2v2H7zM6 4h3v4H6zM4 8h2v3H4zM8 8h2v6H8zM2 11h3v2H2z"/></svg>`,
  trail: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M1 14h3v-2H1zM4 11h3v-2H4zM7 8h3v-2H7zM10 5h3v-2h-3zM13 2h3V0h-3z"/></svg>`
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

const legendWrapper = document.querySelector('.legend-wrapper');
const legendToggleBtn = document.getElementById('legendToggleBtn');
if (legendToggleBtn && legendWrapper) {
  legendToggleBtn.addEventListener('click', () => {
    legendWrapper.classList.toggle('open');
  });
}

function populateLocationDropdown() {
  const dropdownMenu = document.getElementById('dropdownMenu');
  if (!dropdownMenu) return;
  dropdownMenu.innerHTML = '';

  const uniqueLocations = ['ALL LOCATIONS', ...new Set(camps.map(c => c.location ? c.location.toUpperCase() : ''))];

  if (!uniqueLocations.includes(currentLocationFilter)) {
    currentLocationFilter = 'ALL LOCATIONS';
  }
  
  const selectedTextEl = document.getElementById('selectedOptionText');
  if (selectedTextEl) selectedTextEl.textContent = currentLocationFilter;

  uniqueLocations.forEach(loc => {
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

  camps.forEach(camp => {
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
    if (camp.forest) activeIcons.push(PIXEL_ICONS.forest);
    if (camp.mountain) activeIcons.push(PIXEL_ICONS.mountain);
    if (camp.river) activeIcons.push(PIXEL_ICONS.river);
    if (camp.beach) activeIcons.push(PIXEL_ICONS.beach);
    if (camp.hiking) activeIcons.push(PIXEL_ICONS.hiking);
    if (camp.trail) activeIcons.push(PIXEL_ICONS.trail);

    const iconsHtml = activeIcons.map(iconSvg => `<span class="card-icon-badge">${iconSvg}</span>`).join('');

    const card = document.createElement('article');
    card.className = 'camp-card';
    card.innerHTML = `
      <div class="card-menu-container">
        <button class="card-menu-btn" title="Options">⋮</button>
        <div class="card-dropdown-menu">
          <button class="card-edit-btn" data-id="${camp.id}">EDIT</button>
        </div>
      </div>
      <div class="card-image-wrapper">
        <img src="${camp.img || ''}" alt="${camp.name || 'Campsite'}" class="card-image">
      </div>
      <div class="card-content">
        <h2 class="camp-title">${camp.name || ''}</h2>
        <div class="card-icons-row">
          ${iconsHtml}
        </div>
        <div class="card-actions">
          <span class="camp-location">${camp.locDetails || ''}</span>
        </div>
      </div>
    `;

    const menuBtn = card.querySelector('.card-menu-btn');
    const dropdownMenu = card.querySelector('.card-dropdown-menu');

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.card-dropdown-menu').forEach(m => {
        if (m !== dropdownMenu) m.classList.remove('open');
      });
      dropdownMenu.classList.toggle('open');
    });

    card.addEventListener('click', (e) => {
      if (!e.target.closest('.card-menu-container')) {
        openDetailModal(camp);
      }
    });

    card.querySelector('.card-edit-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.remove('open');
      openEditorModal(camp);
    });

    cardGrid.appendChild(card);
  });

  populateLocationDropdown();
  filterCards();
}

document.addEventListener('click', () => {
  document.querySelectorAll('.card-dropdown-menu').forEach(m => m.classList.remove('open'));
});

const modalOverlay = document.getElementById('modalOverlay');
function openDetailModal(camp) {
  if (!modalOverlay) return;
  document.getElementById('modalImg').src = camp.img || '';
  document.getElementById('modalTitle').textContent = camp.name || '';
  document.getElementById('modalLoc').textContent = camp.locDetails || '';
  document.getElementById('modalDesc').textContent = camp.desc || '';

  // Google Maps Link
  const mapLink = document.getElementById('modalMapLink');
  if (mapLink) {
    if (camp.mapUrl && camp.mapUrl.trim() !== '') {
      mapLink.href = camp.mapUrl;
      mapLink.style.display = 'inline-block';
    } else {
      mapLink.style.display = 'none';
    }
  }

  // Social Media / Official Page Link
  const siteLink = document.getElementById('modalCampsiteLink');
  if (siteLink) {
    if (camp.link && camp.link.trim() !== '') {
      siteLink.href = camp.link;
      siteLink.style.display = 'inline-block';
    } else {
      siteLink.style.display = 'none';
    }
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
}

const modalCloseBtn = document.getElementById('modalClose');
if (modalCloseBtn && modalOverlay) {
  modalCloseBtn.addEventListener('click', () => modalOverlay.classList.remove('open'));
}

const editorModalOverlay = document.getElementById('editorModalOverlay');
const editorForm = document.getElementById('editorForm');

function openEditorModal(camp = null) {
  if (!editorModalOverlay || !editorForm) return;

  if (camp) {
    document.getElementById('editorTitle').textContent = 'EDIT CAMPSITE';
    document.getElementById('editCampId').value = camp.id;
    document.getElementById('editName').value = camp.name || '';
    document.getElementById('editLoc').value = camp.locDetails || '';
    document.getElementById('editMapUrl').value = camp.mapUrl || '';
    
    // Social Media / Official Link Field
    const editLinkEl = document.getElementById('editLink');
    if (editLinkEl) editLinkEl.value = camp.link || '';

    document.getElementById('editCountry').value = camp.location || '';
    document.getElementById('editImg').value = camp.img || '';
    document.getElementById('editDesc').value = camp.desc || '';

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
    
    document.getElementById('chkForest').checked = !!camp.forest;
    document.getElementById('chkMountain').checked = !!camp.mountain;
    document.getElementById('chkRiver').checked = !!camp.river;
    document.getElementById('chkBeach').checked = !!camp.beach;
    document.getElementById('chkHiking').checked = !!camp.hiking;
    document.getElementById('chkTrail').checked = !!camp.trail;

    const deleteBtn = document.getElementById('deleteBtn');
    if (deleteBtn) deleteBtn.style.display = 'block';
  } else {
    document.getElementById('editorTitle').textContent = 'ADD NEW SPOT';
    editorForm.reset();
    document.getElementById('editCampId').value = '';
    const deleteBtn = document.getElementById('deleteBtn');
    if (deleteBtn) deleteBtn.style.display = 'none';
  }
  editorModalOverlay.classList.add('open');
}

const editorModalCloseBtn = document.getElementById('editorModalClose');
if (editorModalCloseBtn && editorModalOverlay) {
  editorModalCloseBtn.addEventListener('click', () => editorModalOverlay.classList.remove('open'));
}

const suggestBtn = document.getElementById('suggestBtn');
if (suggestBtn) {
  suggestBtn.addEventListener('click', () => openEditorModal());
}

// Form submit event connected to Firestore
if (editorForm) {
  editorForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = editorForm.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'SAVING...';
    }

    try {
      const id = document.getElementById('editCampId').value;
      const editLinkEl = document.getElementById('editLink');

      const campData = {
        id: id || 'camp_' + Date.now(),
        name: document.getElementById('editName').value.toUpperCase(),
        locDetails: document.getElementById('editLoc').value.toUpperCase(),
        mapUrl: document.getElementById('editMapUrl').value.trim(),
        link: editLinkEl ? editLinkEl.value.trim() : '',
        location: document.getElementById('editCountry').value.toUpperCase().trim(),
        img: document.getElementById('editImg').value,
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
        
        forest: document.getElementById('chkForest').checked,
        mountain: document.getElementById('chkMountain').checked,
        river: document.getElementById('chkRiver').checked,
        beach: document.getElementById('chkBeach').checked,
        hiking: document.getElementById('chkHiking').checked,
        trail: document.getElementById('chkTrail').checked
      };

      await saveCampToCloud(campData);
      if (editorModalOverlay) editorModalOverlay.classList.remove('open');
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

// Delete click event connected to Firestore
const deleteBtn = document.getElementById('deleteBtn');
if (deleteBtn) {
  deleteBtn.addEventListener('click', async () => {
    const id = document.getElementById('editCampId').value;
    if (confirm('ARE YOU SURE YOU WANT TO DELETE THIS CAMPSITE?')) {
      try {
        await deleteCampFromCloud(id);
        if (editorModalOverlay) editorModalOverlay.classList.remove('open');
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
  if (!searchInput) return;
  const query = searchInput.value.toLowerCase().trim();
  const selectedLoc = currentLocationFilter;

  const cards = document.querySelectorAll('.camp-card');
  let visibleCount = 0;

  cards.forEach((card, index) => {
    const camp = camps[index];
    if (!camp) return;

    const matchesSearch = query === '' || (camp.name && camp.name.toLowerCase().startsWith(query));
    const matchesLocation = selectedLoc === 'ALL LOCATIONS' || camp.location === selectedLoc;

    let matchesAmenities = true;
    activeAmenities.forEach(amenity => {
      if (!camp[amenity]) {
        matchesAmenities = false;
      }
    });

    if (matchesSearch && matchesLocation && matchesAmenities) {
      card.style.display = 'block';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

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

renderLegend();
