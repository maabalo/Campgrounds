// ── UI INIT: Sidebar toggles, Burger, Province list ──

// Burger menu
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

// Filter toggle (sidebar)
const filterToggleBtn = document.getElementById('filterToggleBtn');
const filterWrapper   = document.getElementById('filterWrapper');
if (filterToggleBtn && filterWrapper) {
  filterToggleBtn.addEventListener('click', () => {
    filterWrapper.classList.toggle('open');
    filterToggleBtn.classList.toggle('open');
  });
}

// Legend toggle (sidebar)
const legendToggleBtn = document.getElementById('legendToggleBtn');
const legendWrapper   = document.getElementById('legendWrapper');
if (legendToggleBtn && legendWrapper) {
  legendToggleBtn.addEventListener('click', () => {
    legendWrapper.classList.toggle('open');
    legendToggleBtn.classList.toggle('open');
  });
}

// ── Province list (populated from camps data) ──
// Called from script.js after camps load via window.buildProvinceList
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
