// ── UI INIT ──

// FIX 1: Burger menu
const burgerBtn      = document.getElementById('burgerBtn');
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

// FIX 5: Legend toggle
const legendToggleBtn = document.getElementById('legendToggleBtn');
const legendWrapper   = document.getElementById('legendWrapper');
if (legendToggleBtn && legendWrapper) {
  legendToggleBtn.addEventListener('click', () => {
    legendWrapper.classList.toggle('open');
    legendToggleBtn.classList.toggle('open');
  });
}

// FIX 2: Camping Style multi-select dropdown
const campingStyleTrigger = document.getElementById('campingStyleTrigger');
const campingStyleDropdown = document.getElementById('campingStyleDropdown');
const campingStyleMenu    = document.getElementById('campingStyleMenu');
const campingStyleText    = document.getElementById('campingStyleText');

if (campingStyleTrigger && campingStyleDropdown) {
  // Toggle dropdown open/close
  campingStyleTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    campingStyleDropdown.classList.toggle('open');
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!campingStyleDropdown.contains(e.target)) {
      campingStyleDropdown.classList.remove('open');
    }
  });

  // Prevent dropdown from closing when clicking inside
  campingStyleMenu.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Handle checkbox changes
  campingStyleMenu.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const checked = [...campingStyleMenu.querySelectorAll('input:checked')];
      const amenities = checked.map(c => c.getAttribute('data-amenity'));

      // Update label text
      if (amenities.length === 0) {
        campingStyleText.textContent = 'SELECT CAMPING STYLE';
      } else if (amenities.length === 1) {
        campingStyleText.textContent = checked[0].parentElement.textContent.trim();
      } else {
        campingStyleText.textContent = `${amenities.length} SELECTED`;
      }

      // Sync with activeAmenities in script.js
      if (window.activeAmenities) {
        // Remove all camping/terrain amenities first
        const allStyleAmenities = [
          'carCamping','motorCamping','tentOnly','hammock',
          'forest','mountain','river','beach','hiking','trail',
          'wifi','pisoWifi','restroom','electricity','parking','trees','signal'
        ];
        allStyleAmenities.forEach(a => window.activeAmenities.delete(a));
        amenities.forEach(a => window.activeAmenities.add(a));
      }

      // Trigger filter
      if (typeof window.filterCards === 'function') window.filterCards();
    });
  });
}

// Province list builder
window.buildProvinceList = function(camps, currentLocationFilter, onSelect) {
  const container = document.getElementById('provinceList');
  if (!container) return;
  container.innerHTML = '';

  const locations = [...new Set(camps.map(c => c.location).filter(Boolean))].sort();
  const all = ['ALL PROVINCES', ...locations];

  all.forEach(loc => {
    const item = document.createElement('div');
    item.className = 'province-item' + (loc === currentLocationFilter ? ' selected' : '');

    const count = loc === 'ALL PROVINCES'
      ? camps.length
      : camps.filter(c => c.location === loc).length;

    item.innerHTML = `
      <input type="checkbox" ${loc === currentLocationFilter ? 'checked' : ''}>
      <span style="flex:1">${loc}</span>
      <span class="province-count">(${count})</span>
    `;

    item.addEventListener('click', () => {
      document.querySelectorAll('.province-item').forEach(i => {
        i.classList.remove('selected');
        i.querySelector('input').checked = false;
      });
      item.classList.add('selected');
      item.querySelector('input').checked = true;
      onSelect(loc);
    });

    container.appendChild(item);
  });
};
