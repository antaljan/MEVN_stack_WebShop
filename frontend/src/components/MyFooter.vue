<template>
  <footer class="footer">
    <div class="social-media-links">
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
        <i class="fab fa-facebook"></i> Facebook
      </a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
        <i class="fab fa-twitter"></i> Twitter
      </a>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
        <i class="fab fa-instagram"></i> Instagram
      </a>
    </div>
  </footer>
</template>

<script>
export default {
  name: "MyFooter",
};
</script>

<style scoped>
.footer {
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 1rem 0;
}

.social-media-links a {
  margin: 0 10px;
  color: #fff;
  text-decoration: none;
}

.social-media-links a:hover {
  color: #1da1f2;
}
</style>