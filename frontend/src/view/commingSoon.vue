<template>
  <div>
    <div class="bgimg w3-display-container w3-animate-opacity w3-text-white">
      <div class="w3-display-topleft w3-padding-large w3-xlarge">
        YOWAYOLI.COM
      </div>
      <div class="w3-display-middle">
        <h1 class="coming-title">COMING SOON</h1>
        <hr class="w3-border-grey" style="margin:auto;width:40%">
        <p class="coming-subtitle">Your way is your life!</p>
      </div>
      <div class="w3-display-bottomleft w3-padding-large">
        Powered by <a href="https://www.w3schools.com/w3css/default.asp" target="_blank">w3.css</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ComingSoon"
};
</script>

<style scoped>
.bgimg {
  min-height: 100vh;
  background-position: center;
  background-size: cover;
  background-image: url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80');
}

/* Responsive Textgrößen mit Viewport-Einheiten */
.coming-title {
  font-size: 8vw;
  font-weight: bold;
  text-align: center;
}

.coming-subtitle {
  font-size: 3vw;
  text-align: center;
}

/* Optional: Für sehr kleine Bildschirme die Schriftgröße begrenzen */
@media (max-width: 600px) {
  .coming-title {
    font-size: 12vw;
  }
  .coming-subtitle {
    font-size: 5vw;
  }
}
</style>
