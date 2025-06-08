<template>
  <header class="header">
    <div class="logo">
<img :src="require('@/assets/MyLogo.png')" alt="Logo">
      <span class="name">Edith Skills Lab</span>
    </div>
    <nav class="nav">
      <ul>
        <li @mouseover="toggleDropdown(true)" @mouseleave="toggleDropdown(false)">
          <a href="#">Menü</a>
          <ul v-show="dropdownOpen" class="dropdown">
            <li><a href="#">Kezdőlap</a></li>
            <li><a href="#">Webdesign</a></li>
            <li><a href="#">Fejlesztés</a></li>
            <li><a href="#">Marketing</a></li>
            <li><a href="#">Kapcsolat</a></li>
          </ul>
        </li>
      </ul>
    </nav>
    <button class="subscribe">Feliratkozás</button>
  </header>
</template>

<script>
export default {
  data() {
    return {
      dropdownOpen: false
    };
  },
  methods: {
    toggleDropdown(state) {
      this.dropdownOpen = state;
    }
  }
};
</script>

<style scoped>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.header {
    position: fixed;
    top: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 30px;
    background: #f5eded;
    color: rgb(10, 10, 10);
    z-index: 1000;
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  height: 40px;
  margin-right: 10px;
}

.nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
}

.nav ul li {
  position: relative;
  margin: 0 15px;
}

.nav ul li a {
    color: black;
    text-decoration: none;
    padding: 10px;
}

.nav ul .dropdown {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: #f5eded;
  color: black;
  padding: 10px;
  list-style: none;
}

.nav ul li:hover .dropdown {
  display: block;
}

.subscribe {
  background: #ff6600;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
}

.subscribe:hover {
  background: #ff4500;
}
</style>
