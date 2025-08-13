<template>
  <v-app>
  <div class="w3-content w3-container" id="schedule">
    <v-sheet class="d-flex" height="54" tile>
      <v-select
        v-model="type"
        :items="types"
        item-text="text"
        item-value="value"
        label="Nézet"
        variant="outlined"
        hide-details
      />
    </v-sheet>

    <v-sheet>
      <v-calendar
        ref="calendar"
        v-model="value"
        :events="events"
        :view-mode="type"
        :weekdays="weekday"
        @click:event="handleSlotClick"
      />
      <v-btn @click="console.log(events)">Események kiírása</v-btn>

    </v-sheet>
  </div>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
const type = ref('month')
const types = [
  { text: 'Hónap', value: 'month' },
  { text: 'Hét', value: 'week' },
  { text: 'Nap', value: 'day' }
]
const weekday = [1, 2, 3, 4, 5, 6, 0]
const value = ref([new Date()])
const events = ref([])
const userName = ref('Teszt Felhasználó') // Teszteléshez
const userEmail = ref('teszt@example.com')

// 🕘 Időpontok generálása
function generateTimeSlots(date) {
  const slots = []
  const baseDate = new Date(date)
  baseDate.setHours(9, 0, 0, 0)
  for (let i = 0; i < 8; i++) {
    const start = new Date(baseDate.getTime() + i * 3600000)
    const end = new Date(start.getTime() + 3600000)
    slots.push({
      title: `Foglalható időpont (${start.getHours()}:00)`,
      start,
      end,
      color: 'green',
      allDay: false,
      extendedProps: {
        available: true
      }
  })
  }
  events.value = slots
  console.log("idöponmt generalva:",events.value)
}

// 📩 Foglalás mentése
async function bookSlot(slot) {
  try {
    await axios.post('/api/bookings', {
      name: userName.value,
      email: userEmail.value,
      start: slot.start,
      end: slot.end
    })
    // 🔄 Vizuális frissítés
    slot.extendedProps.available = false
    slot.color = 'grey'
    slot.title = 'Lefoglalt időpont'
    alert(`Foglalás sikeres: ${slot.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`)
  } catch (error) {
    console.error('Foglalás sikertelen:', error)
    alert('Hiba történt a foglalás során.')
  }
}

// 🖱️ Kattintás kezelése
function handleSlotClick(event) {
  console.log("Kattintott esemény:", event)

  if (!event || !event.start) {
    alert('Ez az esemény nem foglalható.')
    return
  }

  const original = events.value.find(e => e.start.getTime() === new Date(event.start).getTime())

  if (!original) {
    alert('Nem található az időpont.')
    return
  }

  if (original.extendedProps?.available) {
    bookSlot(original)
  } else {
    alert('Ez az időpont már foglalt.')
  }
}



onMounted(() => {
  generateTimeSlots(new Date())
})

</script>

