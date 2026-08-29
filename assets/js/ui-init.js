// ── UI INIT: Panel toggles, Burger menu, Category strip ──

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
  document.addEventListener('click', () => {
    burgerDropdown.classList.remove('open');
  });
}

// ── CATEGORY STRIP — Airbnb-style quick filter ──
const stripItems = document.querySelectorAll('.category-strip-item');

stripItems.forEach(item => {
  item.addEventListener('click', () => {
    // Update active state
    stripItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    const amenity = item.getAttribute('data-amenity');

    // Clear all amenity filter buttons first
    document.querySelectorAll('.amenity-toggle-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    if (amenity === 'all') {
      // Clear all active amenities — show everything
      if (window.activeAmenities) window.activeAmenities.clear();
    } else {
      // Set the matching amenity filter button active
      const matchingBtn = document.querySelector(`.amenity-toggle-btn[data-amenity="${amenity}"]`);
      if (matchingBtn) matchingBtn.classList.add('active');

      // Sync with script.js activeAmenities Set
      if (window.activeAmenities) {
        window.activeAmenities.clear();
        window.activeAmenities.add(amenity);
      }
    }

    // Trigger filterCards if it exists on window
    if (typeof window.filterCards === 'function') {
      window.filterCards();
    }
  });
});
