// DOM Elements
const searchInput = document.getElementById('searchInput');
const sortBtn = document.getElementById('sortBtn');
const cardGrid = document.getElementById('cardGrid');
const noResults = document.getElementById('noResults');

// Custom Dropdown Elements
const customDropdown = document.getElementById('customDropdown');
const dropdownTrigger = document.getElementById('dropdownTrigger');
const selectedOptionText = document.getElementById('selectedOptionText');
const dropdownItems = document.querySelectorAll('.dropdown-item');

// Detail Modal Elements
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalLoc = document.getElementById('modalLoc');
const modalDesc = document.getElementById('modalDesc');
const amenitiesGrid = document.getElementById('amenitiesGrid');

// Suggestion Modal Elements
const suggestBtn = document.getElementById('suggestBtn');
const suggestModalOverlay = document.getElementById('suggestModalOverlay');
const suggestModalClose = document.getElementById('suggestModalClose');
const suggestForm = document.getElementById('suggestForm');

let selectedLocationValue = 'ALL';
const cards = Array.from(document.querySelectorAll('.camp-card'));

// Pixel SVG Icon Generators
const PIXEL_ICONS = {
  trees: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M7 1h2v2H7zM6 3h4v2H6zM5 5h6v2H5zM4 7h8v2H4zM3 9h10v2H3zM7 11h2v4H7z"/></svg>`,
  restroom: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M2 2h5v2H2zM2 4h1v10H2zM6 4h1v10H6zM3 7h3v2H3zM10 2h4v2h-4zM11 4h2v5h-2zM9 9h6v2H9zM10 11h1v3h-1zM13 11h1v3h-1z"/></svg>`,
  electricity: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M9 1H6v5H3l5 9V9h3z"/></svg>`,
  wifi: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M2 3h12v2H2zM4 6h8v2H4zM6 9h4v2H6zM7 12h2v2H7z"/></svg>`,
  signal: `<svg class="pixel-icon" viewBox="0 0 16 16"><path d="M1 12h2v3H1zM5 9h2v6H5zM9 6h2v9H9zM13 2h2v13h-2z"/></svg>`
};

// Open Detail Modal
cards.forEach(card => {
  card.addEventListener('click', () => {
    modalImg.src = card.dataset.img;
    modalTitle.textContent = card.dataset.name;
    modalLoc.textContent = card.dataset.loc;
    modalDesc.textContent = card.dataset.desc;

    amenitiesGrid.innerHTML = '';
    
    if (card.dataset.trees === 'true') {
      amenitiesGrid.innerHTML += `<div class="amenity-chip">${PIXEL_ICONS.trees} TREES</div>`;
    }
    if (card.dataset.restroom === 'true') {
      amenitiesGrid.innerHTML += `<div class="amenity-chip">${PIXEL_ICONS.restroom} RESTROOM</div>`;
    }
    if (card.dataset.electricity === 'true') {
      amenitiesGrid.innerHTML += `<div class="amenity-chip">${PIXEL_ICONS.electricity} POWER</div>`;
    }
    if (card.dataset.wifi === 'true') {
      amenitiesGrid.innerHTML += `<div class="amenity-chip">${PIXEL_ICONS.wifi} WI-FI</div>`;
    }
    if (card.dataset.signal === 'true') {
      amenitiesGrid.innerHTML += `<div class="amenity-chip">${PIXEL_ICONS.signal} SIGNAL</div>`;
    }

    modalOverlay.classList.add('open');
  });
});

// Close Detail Modal
modalClose.addEventListener('click', () => modalOverlay.classList.remove('open'));
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) modalOverlay.classList.remove('open');
});

// Open Suggestion Modal
suggestBtn.addEventListener('click', () => {
  suggestModalOverlay.classList.add('open');
});

// Close Suggestion Modal
suggestModalClose.addEventListener('click', () => suggestModalOverlay.classList.remove('open'));
suggestModalOverlay.addEventListener('click', (e) => {
  if (e.target === suggestModalOverlay) suggestModalOverlay.classList.remove('open');
});

// Submit Suggestion
suggestForm.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('THANK YOU! YOUR CAMPSITE SUGGESTION HAS BEEN SUBMITTED.');
  suggestForm.reset();
  suggestModalOverlay.classList.remove('open');
});

// Custom Dropdown Events
dropdownTrigger.addEventListener('click', (e) => {
  e.stopPropagation();
  customDropdown.classList.toggle('open');
});

dropdownItems.forEach(item => {
  item.addEventListener('click', () => {
    dropdownItems.forEach(i => i.classList.remove('selected'));
    item.classList.add('selected');

    selectedLocationValue = item.getAttribute('data-value');
    selectedOptionText.textContent = item.textContent;

    customDropdown.classList.remove('open');
    filterCards();
  });
});

document.addEventListener('click', () => {
  customDropdown.classList.remove('open');
});

// Filter & Search Function (Starts-With Match)
function filterCards() {
  const query = searchInput.value.toLowerCase().trim();
  let visibleCount = 0;

  cards.forEach(card => {
    const title = card.querySelector('.camp-title').textContent.toLowerCase();
    const cardLocationAttr = card.getAttribute('data-location');

    const matchesSearch = query === '' || title.startsWith(query);
    const matchesLocation = selectedLocationValue === 'ALL' || cardLocationAttr === selectedLocationValue;

    if (matchesSearch && matchesLocation) {
      card.style.display = 'block';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  noResults.style.display = visibleCount === 0 ? 'block' : 'none';
}

// Alphabetical Sorting
function sortCards() {
  const currentSort = sortBtn.getAttribute('data-sort');
  const isAscending = currentSort === 'asc';

  cards.sort((a, b) => {
    const titleA = a.querySelector('.camp-title').textContent;
    const titleB = b.querySelector('.camp-title').textContent;
    return isAscending ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
  });

  if (isAscending) {
    sortBtn.setAttribute('data-sort', 'desc');
    sortBtn.textContent = 'SORT: Z-A';
  } else {
    sortBtn.setAttribute('data-sort', 'asc');
    sortBtn.textContent = 'SORT: A-Z';
  }

  cards.forEach(card => cardGrid.appendChild(card));
}

// Event Listeners
searchInput.addEventListener('input', filterCards);
sortBtn.addEventListener('click', sortCards);