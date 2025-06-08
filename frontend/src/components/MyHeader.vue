<template>
      <header>
        <h1>Edit Skills Lab </h1>
        <nav>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header></template>

<script>
export default {
  name: "MyHeader",
};
</script>


<style>
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #333;
  color: #fff;
  padding: 1rem;
  text-align: center;
  z-index: 1000; /* Ensures it stays above other elements */
}
nav ul {
  list-style: none;
  padding: 0;
   color: #fff;
}
nav li {
  display: inline;
  margin: 0 10px;
  color: #fff;
}
</style>