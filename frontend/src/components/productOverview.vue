<template>
  <MyHeader/>
  <v-container class="w3-container w3-padding-top-64">
    <div id="warenkorb">
      <h2>🛒 Bevásárló kosár (<span id="cart-count">0</span>)</h2>
    </div>
    <!-- list of products -->
    <section id="produkte">
      <h2>A termékeim</h2>
      <div class="produkt-grid" id="produkt-grid">
        <!-- Products -->
      </div>
    </section>
 <!-- Warenkorb overlay -->
  <div id="cart-overlay" class="overlay">
    <div class="overlay-content">
      <h2>🛒 Bevásárló kosár</h2>
      <ul id="cart-items"></ul>
      <button onclick="closeCart()">Bezárás</button>
      <button onclick="clearCart()">Kosár ürítése</button>
      <button onclick="checkout()">Fizetés</button>
    </div>
  </div>
  </v-container>
  <MyFooter/>
</template>

<script setup>
  import MyHeader from '../components/MyHeader.vue';
  import MyFooter from '../components/MyFooter.vue';
  import { onMounted } from 'vue'
// declarations product is symulated has to load from backend
    let warenkorb = JSON.parse(localStorage.getItem("warenkorb")) || [];
    let products = [
      { id: 1, cover: "./cover1.jpg", title: "Stresz csökkentés", description: "bla bla bla bla", price: "30", source: "hier befindetsich 1" },
      { id: 2, cover: "./cover2.jpg", title: "Aszertív kommunikáció", description: "bla blu bli ble blo", price: "20", source: "hier befindetsich 2" },
      { id: 3, cover: "./cover3.jpg", title: "GTD (Getting Thinks Done) módszer", description: "balalalalalalalal bla bla", price: "50", source: "hier befindetsich 3" },
    ];
    onMounted(() => {
      updateCartCount();
      loadProduct();
      document.getElementById("warenkorb").addEventListener("click", openCart);
    });
    // Products load on screen
    function loadProduct() {
      const productContainer = document.getElementById("produkt-grid");
      productContainer.innerHTML = "";
      products.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.className = "produkt";
        productDiv.innerHTML = `
          <img src="${product.cover}" alt="${product.title}">
          <h3>${product.title}</h3>
          <p>${product.description}</p>
          <button onclick="toBucket(${product.id})">Megveszem – €${product.price}</button>
        `;
        productContainer.appendChild(productDiv);
      });
    }
    // add product to product bucket
    function toBucket(productId) {
      const product = products.find(p => p.id === productId);
      if (product) {
        warenkorb.push(product);
        updateCartCount();
        localStorage.setItem("warenkorb", JSON.stringify(warenkorb));
      }
    }
    // Expose toBucket to global scope for inline onclick
    window.toBucket = toBucket;
    // update product bucket
    function updateCartCount() {
      const cartCount = document.getElementById("cart-count");
      cartCount.textContent = warenkorb.length;
    }
    // open product bucket
    function openCart() {
      const overlay = document.getElementById("cart-overlay");
      const cartItems = document.getElementById("cart-items");
      cartItems.innerHTML = "";
      if (warenkorb.length === 0) {
        cartItems.innerHTML = "<li>Ez a kosár sajnos üres.</li>";
      } else {
        warenkorb.forEach((item, index) => {
          const li = document.createElement("li");
          li.innerHTML = `
            <strong>${item.title}</strong> – €${item.price}
            <button onclick="removeFromCart(${index})">Törlés</button>
          `;
          cartItems.appendChild(li);
        });
        // Gesamtpreis anzeigen
          const total = calculateTotal();
          const totalLi = document.createElement("li");
          totalLi.innerHTML = `<strong>Végösszeg:</strong> €${total.toFixed(2)}`;
          cartItems.appendChild(totalLi);
      }
      overlay.style.display = "flex";
    }
    //close product bucket
    function closeCart() {
      document.getElementById("cart-overlay").style.display = "none";
    }
    window.closeCart = closeCart;
    // remove item from product bucket
    function removeFromCart(index) {
      warenkorb.splice(index, 1); // Entfernt das Produkt an der Stelle "index"
      updateCartCount();          // Aktualisiert die Anzeige im Header
      localStorage.setItem("warenkorb", JSON.stringify(warenkorb));
      openCart();                 // Aktualisiert das Overlay
    }
    // Expose removeFromCart to global scope for inline onclick
    window.removeFromCart = removeFromCart;
    // summe price
    function calculateTotal() {
      return warenkorb.reduce((sum, item) => sum + parseFloat(item.price), 0);
    }
    // clean product bucket
    function clearCart() {
      warenkorb = [];
      localStorage.removeItem("warenkorb");
      updateCartCount();
      openCart(); // Aktualisiert die Anzeige
    }
    window.clearCart = clearCart;
    // to casse
    function checkout() {
      if (warenkorb.length === 0) {
        alert("A bevásárló kosarad üres.");
        return;
      }
      const total = calculateTotal().toFixed(2);
      alert(`Köszönöm a vásárlást!\nVégösszeg: €${total}`);
      // Warenkorb leeren nach Bestellung
      clearCart();
      closeCart();
    }
    // Expose checkout to global scope for inline onclick
    window.checkout = checkout;
</script>

<style>
body {
            font-family: Arial, sans-serif;
            margin: 0;
            background-color: #f4f4f4;
        }
        header {
            background-color: #333;
            color: white;
            padding: 1em;
        }
        nav ul {
            list-style: none;
            display: flex;
            gap: 1em;
        }
        nav li {
          color-scheme: white;
        }
        .produkt-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1em;
            padding: 1em;
        }
        .produkt {
            background-color: white;
            padding: 1em;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .produkt img {
          width: 100%;
          height: auto;
          border-radius: 4px;
        }
        #warenkorb {
          float: right;
          font-size: 1.2em;
          margin-top: -2.5em;
          margin-right: 1em;
          cursor: pointer;
        }
      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.6);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }
      .overlay-content {
        background-color: white;
        padding: 2em;
        border-radius: 8px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 0 20px rgba(0,0,0,0.3);
      }
      #cart-items {
        list-style: none;
        padding: 0;
      }
      #cart-items li {
        margin-bottom: 1em;
        border-bottom: 1px solid #ccc;
        padding-bottom: 0.5em;
      }
      #cart-items button {
        margin-left: 1em;
        background-color: #e74c3c;
        color: white;
        border: none;
        padding: 0.3em 0.6em;
        border-radius: 4px;
        cursor: pointer;
      }
      #cart-items button:hover {
        background-color: #c0392b;
      }
      .overlay-content button {
        margin: 1em 0.5em 0 0;
        padding: 0.5em 1em;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .overlay-content button:first-of-type {
        background-color: #3498db;
        color: white;
      }
      .overlay-content button:last-of-type {
        background-color: #e74c3c;
        color: white;
      }
      .overlay-content button:hover {
        opacity: 0.9;
      }
      .overlay-content button:nth-of-type(3) {
        background-color: #2ecc71;
        color: white;
      }
</style>