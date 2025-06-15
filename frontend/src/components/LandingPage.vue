<template>
<!-- First Parallax Image with Logo Text -->
<div class="bgimg-1 w3-display-container w3-opacity-min" id="home">
  <div class="w3-display-middle" style="white-space:nowrap;">
    <span class="w3-center w3-padding-large w3-black w3-xlarge w3-wide w3-animate-opacity">Edith <span class="w3-hide-small">Skills</span> Lab</span>
  </div>
</div>

<!-- Container (About Section) -->
<div class="w3-content w3-container w3-padding-64" id="about">
  <h3 class="w3-center">Rólam</h3>
  <p class="w3-center"><em>Pszichológus, Coach, Életmód-tanácsadó és terapeuta</em></p>
  <p>Elkötelezetten támogatom ügyfeleimet önismereti útjukon és életvezetési kihívásaik megoldásában. Szakértelmem kiterjed az életmód-tanácsadásra és terápiára is, így holisztikus szemlélettel állok mellettük.</p>
  <div class="w3-row">
    <div class="w3-col m6 w3-center w3-padding-large">
      <p><b><i class="fa fa-user w3-margin-right"></i>Antali Gyöngyi Edit</b></p><br>
      <img src="avatar_hat.jpg" class="w3-round w3-image w3-opacity w3-hover-opacity-off" alt="Photo of Me" width="500" height="333">
    </div>

    <!-- Hide this text on small devices -->
    <div class="w3-col m6 w3-hide-small w3-padding-large">
      <p>Antali Gyöngyi Edit ügyfelei általában pozitívan értékelik a munkáját, különösen az empatikus hozzáállását és hatékony támogatását. A visszajelzések alapján sokan kiemelik, hogy segített nekik mélyebb önismeretre jutni és életük nehéz szakaszain túllendülni. 
        Ha szeretnéd megnézni konkrét véleményeket, érdemes ellátogatni a Facebook oldalára, ahol ügyfelei gyakran osztják meg tapasztalataikat.</p>
    </div>
  </div>
  
</div>

<!-- Second Parallax Image with Portfolio Text -->
<div class="bgimg-2 w3-display-container w3-opacity-min">
  <div class="w3-display-middle">
    <span class="w3-xxlarge w3-text-white w3-wide">Kapcsolat</span>
  </div>
</div>

<!-- Container (Contact Section) -->
<div class="w3-content w3-container w3-padding-64" id="contact">
  <h3 class="w3-center">Kapcsolat</h3>
  <p class="w3-center"><em>Nagyon érdekel a véleményed!</em></p>

  <div class="w3-row w3-padding-32 w3-section">
 
      <p>Ugorj be egy <i class="fa fa-coffee"></i>, vagy írj egy üzenetet:</p>
      <form action="/action_page.php" target="_blank">
        <div class="w3-row-padding" style="margin:0 -16px 8px -16px">
          <div class="w3-half">
            <input class="w3-input w3-border" type="text" placeholder="Name" required name="Name">
          </div>
          <div class="w3-half">
            <input class="w3-input w3-border" type="text" placeholder="Email" required name="Email">
          </div>
        </div>
        <input class="w3-input w3-border" type="text" placeholder="Message" required name="Message">
        <button class="w3-button w3-black w3-right w3-section" type="submit">
          <i class="fa fa-paper-plane"></i> SEND MESSAGE
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>

</script>


