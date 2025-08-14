<!-- components/BookingCalendar.vue -->
<template>
  <v-contener>
  <vue-cal
    :events="events"
    :disable-views="['years', 'week']"
    default-view="day"
    :time="true"
    :on-event-click="onEventClick"
    :on-cell-click="onCellClick"
    style="height: 400px;"
  />
  <div class="w3-center">
    <v-btn
      color="primary"
      @click="admindialog = true"
      class="w3-btn"
    >időpont hozzáadása</v-btn>
  </div>
  <v-dialog v-model="userdialog" max-width="500">
  <v-card>
    <v-card-title>Időpont foglalása</v-card-title>
    <v-card-text>
      Kiválasztott időpont: {{ selectedTime }}
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="confirmBooking">Foglalás</v-btn>
      <v-btn text @click="userdialog = false">Mégse</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
<v-dialog v-model="admindialog" max-width="500">
    <v-card>
      <v-card-title>Új foglalható időpont</v-card-title>
      <v-card-text>
        <v-text-field v-model="title" label="Slot címe" />
        <v-text-field
          v-model="start"
          label="Kezdési időpont"
          type="datetime-local"
        />
        <v-text-field
          v-model="duration"
          label="Időtartam (perc)"
          type="number"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="saveSlot">Mentés</v-btn>
        <v-btn text @click="admindialog = false">Mégse</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-contener>
</template>

<script setup>
import { ref } from 'vue'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { onMounted } from 'vue'
const userdialog = ref(false)
const admindialog = ref(false)
const title = ref('')
const start = ref('')
const duration = ref(60)
const events = ref([])

// loading events from API
onMounted(async () => {
  fetch('https://yowayoli.com/api/booking/all')
  .then(res => res.json())
  .then(data => {
    events.value = data.map(event => ({
      title: event.title,
      start: event.start,
      end: event.end,
      classe: event.available ? 'available' : 'unavailable',
      user: event.user ? event.user : 'N/A'
    }))
  })
  .catch(err => console.error('Hiba az események betöltésekor:', err))
})

// handling click on event
function onEventClick(event) {
  alert(`Ez az időpont már foglalt: ${event.title}`)
}

// handling click on cell
function onCellClick(cell) {
  const selectedTime = cell.start
  // Itt lehet API hívás a foglaláshoz
  alert(`Kiválasztott időpont: ${selectedTime}`)
}

// save new slot
async function saveSlot() {
  const startDate = new Date(start.value)
  const endDate = new Date(startDate.getTime() + duration.value * 60000)
  const newSlot = {
    title: title.value,
    start: startDate.toISOString(),
    end: endDate.toISOString(),
    available: true
  }
  fetch('https://yowayoli.com/api/booking/new', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newSlot)
  })
    .then(res => res.json())
    .then(data => {
      console.log('Szlot mentve:', data)
      admindialog.value = false
      events.value.push({
        title: newSlot.title,
        start: newSlot.start,
        end: newSlot.end,
        classe: 'available',
        user: 'N/A'
      })
    })
}

</script>
