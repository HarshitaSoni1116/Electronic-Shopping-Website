// =========================
// SEARCH FUNCTIONALITY
// =========================
const searchBar = document.getElementById("searchBar");
if (searchBar) {
  searchBar.addEventListener("keyup", function () {
    let filter = searchBar.value.toLowerCase();
    let products = document.querySelectorAll("#productList .product-card");

    products.forEach((product) => {
      let productName = product.getAttribute("data-name");
      product.style.display = productName.toLowerCase().includes(filter)
        ? "block"
        : "none";
    });
  });
}

// =========================
// UPDATE MINI CART COUNT
// =========================
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartCount = document.getElementById("cartCount");
  if (cartCount) cartCount.textContent = totalItems;
}

// =========================
// ADD TO CART (LOCALSTORAGE)
// =========================
const addToCartButtons = document.querySelectorAll(".add-to-cart");

addToCartButtons.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();

    let productCard = btn.closest(".product-card");
    let productName = productCard.querySelector("h3").textContent;
    let productPrice = productCard.querySelector("p").textContent.replace("₹", "");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existing = cart.find((item) => item.name === productName);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name: productName, price: parseFloat(productPrice), qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert(`${productName} added to cart!`);
  });
});

// =========================
// SHOW CART ITEMS AS CARDS
// =========================
const cartContainer = document.getElementById("cartItems");
if (cartContainer) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCart() {
    cartContainer.innerHTML = "";
    let subtotal = 0;

    if (cart.length === 0) {
      cartContainer.innerHTML = `<p style="text-align:center; font-size:20px;">Your cart is empty</p>`;
    } else {
      cart.forEach((item, index) => {
        let total = item.price * item.qty;
        subtotal += total;

        let card = document.createElement("div");
        card.className = "cart-card";
        card.innerHTML = `
   
          <h3>${item.name}</h3>
          <p>₹${item.price}</p>
          <input type="number" value="${item.qty}" min="1" data-index="${index}" />
          <p>Total: ₹${total}</p>
          <button class="remove-btn" data-index="${index}">Remove</button>
        `;
        cartContainer.appendChild(card);
      });
    }

    let shipping = subtotal > 0 ? 100 : 0;
    document.getElementById("subtotal").textContent = subtotal;
    document.getElementById("shipping").textContent = shipping;
    document.getElementById("grandTotal").textContent = subtotal + shipping;

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  }

  cartContainer.addEventListener("input", (e) => {
    if (e.target.type === "number") {
      let index = e.target.getAttribute("data-index");
      cart[index].qty = parseInt(e.target.value);
      updateCart();
    }
  });

  cartContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
      let index = e.target.getAttribute("data-index");
      cart.splice(index, 1);
      updateCart();
    }
  });

  updateCart();
}

// =========================
// INITIALIZE MINI CART ON LOAD
// =========================
updateCartCount();
