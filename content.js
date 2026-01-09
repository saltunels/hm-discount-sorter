console.log("H&M Discount Sorter loaded");

let isActive = false;
let originalOrder = [];

// Convert "-75%" -> 75
function parseDiscount(text) {
  if (!text) return null;
  return parseInt(text.replace("%", "").replace("-", "").trim(), 10);
}

// Get product elements and their discount values
function getProducts() {
  const grid = document.querySelector('ul[data-elid="product-grid"]');
  if (!grid) return { grid: null, items: [] };

  const articles = grid.querySelectorAll('article[data-articlecode]');
  const items = [];

  articles.forEach(article => {
    const discountEl = article.querySelector(
      'div[data-testid="marker"] span'
    );

    if (!discountEl) return;

    const discount = parseDiscount(discountEl.textContent);
    if (isNaN(discount)) return;

    items.push({
      element: article.closest("li"),
      discount
    });
  });

  return { grid, items };
}

// Sort products by highest discount percentage
function sortByDiscount() {
  const { grid, items } = getProducts();
  if (!grid || !items.length) return;

  // Save original order only once
  if (!originalOrder.length) {
    originalOrder = [...grid.children];
  }

  items
    .sort((a, b) => b.discount - a.discount)
    .forEach(item => {
      grid.appendChild(item.element);
    });

  console.log("Products sorted by discount");
}

// Restore original product order
function resetOrder() {
  const grid = document.querySelector('ul[data-elid="product-grid"]');
  if (!grid || !originalOrder.length) return;

  originalOrder.forEach(el => grid.appendChild(el));
  console.log("Original order restored");
}

// Create floating toggle button
function createFloatingButton() {
  const button = document.createElement("button");
  button.innerText = "Sort by discount %";

  Object.assign(button.style, {
    position: "fixed",
    top: "120px",
    right: "20px",
    zIndex: "9999",
    padding: "10px 14px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)"
  });

  button.addEventListener("click", () => {
    if (!isActive) {
      sortByDiscount();
      isActive = true;
      button.innerText = "Reset order";
      button.style.background = "#555";
    } else {
      resetOrder();
      isActive = false;
      button.innerText = "Sort by discount %";
      button.style.background = "#000";
    }
  });

  document.body.appendChild(button);
}

// Initialize after products are loaded (lazy loading)
setTimeout(() => {
  createFloatingButton();
}, 2000);
