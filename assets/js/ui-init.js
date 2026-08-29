// ── UI INIT: Category strip + panel arrow toggles ──
// Note: burger, filter, and legend toggles are already in script.js
// This file only handles the category strip and arrow indicator

// ── Arrow indicator for filter/legend toggle buttons ──
const filterToggleBtn = document.getElementById('filterToggleBtn');
const filterWrapper   = document.getElementById('filterWrapper');
if (filterToggleBtn && filterWrapper) {
  filterToggleBtn.addEventListener('click', () => {
    filterToggleBtn.classList.toggle('panel-open');
  });
}

const legendToggleBtn = document.getElementById('legendToggleBtn');
const legendWrapper   = document.getElementById('legendWrapper');
if (legendToggleBtn && legendWrapper) {
  legendToggleBtn.addEventListener('click', () => {
    legendToggleBtn.classList.toggle('panel-open');
  });
}

// ── CATEGORY STRIP — Airbnb-style quick filter ──
const stripItems = document.querySelectorAll('.category-strip-item');

stripItems.forEach(item => {
  item.addEventListener('click', () => {
    // Update active highlight
    stripItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    const amenity = item.getAttribute('data-amenity');

    // Sync with amenity filter buttons in the filter panel
    document.querySelectorAll('.amenity-toggle-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    if (amenity !== 'all') {
      const matchingBtn = document.querySelector(`.amenity-toggle-btn[data-amenity="${amenity}"]`);
      if (matchingBtn) matchingBtn.classList.add('active');

      if (window.activeAmenities) {
        window.activeAmenities.clear();
        window.activeAmenities.add(amenity);
      }
    } else {
      if (window.activeAmenities) window.activeAmenities.clear();
    }

    // Trigger filter refresh
    if (typeof window.filterCards === 'function') {
      window.filterCards();
    }
  });
});
