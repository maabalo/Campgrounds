// ── UI INIT ──
// NOTE: burger, legend, and filter toggles are handled by script.js
// This file only handles: camping style dropdown + province list

// ── Camping Style multi-select dropdown ──
const campingStyleTrigger  = document.getElementById('campingStyleTrigger');
const campingStyleDropdown = document.getElementById('campingStyleDropdown');
const campingStyleMenu     = document.getElementById('campingStyleMenu');
const campingStyleText     = document.getElementById('campingStyleText');

if (campingStyleTrigger && campingStyleDropdown) {
  campingStyleTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    campingStyleDropdown.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!campingStyleDropdown.contains(e.target)) {
      campingStyleDropdown.classList.remove('open');
    }
  });

  campingStyleMenu.addEventListener('click', (e) => e.stopPropagation());

  campingStyleMenu.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const checked = [...campingStyleMenu.querySelectorAll('input:checked')];
      const amenities = checked.map(c => c.getAttribute('data-amenity'));

      // Update label
      if (amenities.length === 0) {
        campingStyleText.textContent = 'SELECT CAMPING STYLE';
      } else if (amenities.length === 1) {
        campingStyleText.textContent = cb.parentElement.textContent.trim();
      } else {
        campingStyleText.textContent = `${amenities.length} SELECTED`;
      }

      // Sync with script.js activeAmenities
      if (window.activeAmenities) {
        const all = [
          'carCamping','motorCamping','tentOnly','hammock',
          'forest','mountain','river','beach','hiking','trail',
          'wifi','pisoWifi','restroom','electricity','parking','trees','signal'
        ];
        all.forEach(a => window.activeAmenities.delete(a));
        amenities.forEach(a => window.activeAmenities.add(a));
      }

      if (typeof window.filterCards === 'function') window.filterCards();
    });
  });
}

// ── Province list builder (called from script.js) ──
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
