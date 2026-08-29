// ── UI INIT: Panel toggles & Burger menu ──
// This runs after the DOM is ready since script.js is type="module"

// Filter panel toggle
const filterToggleBtn = document.getElementById('filterToggleBtn');
const filterWrapper   = document.getElementById('filterWrapper');
if (filterToggleBtn && filterWrapper) {
  filterToggleBtn.addEventListener('click', () => {
    filterWrapper.classList.toggle('open');
    filterToggleBtn.classList.toggle('panel-open');
  });
}

// Legend panel toggle
const legendToggleBtn = document.getElementById('legendToggleBtn');
const legendWrapper   = document.getElementById('legendWrapper');
if (legendToggleBtn && legendWrapper) {
  legendToggleBtn.addEventListener('click', () => {
    legendWrapper.classList.toggle('open');
    legendToggleBtn.classList.toggle('panel-open');
  });
}

// Burger menu toggle
const burgerBtn      = document.getElementById('burgerBtn');
const burgerDropdown = document.getElementById('burgerDropdown');
if (burgerBtn && burgerDropdown) {
  burgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    burgerDropdown.classList.toggle('open');
  });

  // Close burger when clicking anywhere else
  document.addEventListener('click', () => {
    burgerDropdown.classList.remove('open');
  });
}
