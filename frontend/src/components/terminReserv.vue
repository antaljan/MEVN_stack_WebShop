<template>
  <v-container class="form-container" max-width="600">
    <v-form @submit.prevent>
      <v-card elevation="2" class="pa-4">
        <v-card-title>Időpont foglalás</v-card-title>
        <v-card-text>
          <v-text-field
            label="Név"
            v-model="name"
            required
          ></v-text-field>
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
              v-model="selectedDate"
              label="Kérem válasszon dátumot"
              readonly
              v-bind="props"
              ></v-text-field>
            </template>
          <v-date-picker
            v-model="selectedDate"
            :allowed-dates="verfuegbareDaten"
            @input="menu = false"
            locale="de"
          ></v-date-picker>
        </v-menu>

          <div v-if="gefilterteTermine.length">
            <h3 class="mt-4">Elérhető időpontok:</h3>
            <v-list>
              <v-list-item v-for="termin in gefilterteTermine" :key="termin.id">
                <v-list-item-title>
                  {{ termin.datum }} um {{ termin.zeit }} -
                  <strong :class="termin.status">{{ termin.status }}</strong>
                </v-list-item-title>
                <v-list-item-action v-if="termin.status === 'frei'">
                  <v-btn icon @click="bucheTermin(termin.id)">
                    <v-icon>mdi-calendar-plus</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </div>

          <div v-if="confirmation" class="mt-4">
            <v-alert type="success" border="start" elevation="2">
              <p>Köszönöm szépen <strong>{{ name }}</strong>! Az Időpontot sikeresen lefoglalta.</p>
              <p><strong>Dátum:</strong> {{ confirmation.datum }}</p>
              <p><strong>Időpont:</strong> {{ confirmation.zeit }}</p>
            </v-alert>
          </div>
        </v-card-text>
      </v-card>
    </v-form>
    <v-btn color="primary" class="mt-4" @click="admindialog = true">
      Új időpont hozzáadása
    </v-btn>

<v-dialog v-model="admindialog" max-width="500">
  <v-card>
    <v-card-title>Neuen Termin erstellen</v-card-title>
    <v-card-text>
      <v-text-field label="Titel" v-model="title" />
      <v-text-field label="Startzeit (z.B. 2025-09-22T10:00)" v-model="start" />
      <v-text-field label="Dauer (Minuten)" v-model="duration" type="number" />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="green" @click="saveSlot">Speichern</v-btn>
      <v-btn color="red" @click="admindialog = false">Abbrechen</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const name = ref('');
const selectedDate = ref('');
const menu = ref(false);
const confirmation = ref(null);
const termine = ref([]);

const admindialog = ref(false);
const title = ref('');
const start = ref('');
const duration = ref(60); // Minuten

onMounted(async () => {
  await ladeTermine();
});

async function ladeTermine() {
  try {
    const res = await fetch('https://antaligyongyi.hu/api/booking/all');
    const data = await res.json();
    termine.value = data.map(event => ({
      id: event.id,
      datum: event.start.split('T')[0],
      zeit: event.start.split('T')[1]?.substring(0, 5),
      status: event.slotClass === 'available' ? 'frei' : 'gebucht',
      user: event.user || 'N/A'
    }));
    console.log('Termine geladen:', termine.value);
  } catch (err) {
    console.error('Fehler beim Laden der Termine:', err);
  }
}

const gefilterteTermine = computed(() => {
  if (!selectedDate.value) return [];
  const isoDate = new Date(selectedDate.value).toISOString().split("T")[0];
  return termine.value.filter(t => t.datum === isoDate);
});

const verfuegbareDaten = (date) => {
  const isoDate = new Date(date).toISOString().split("T")[0];
  return termine.value.some(t => t.status === "frei" && t.datum === isoDate);
};

function bucheTermin(id) {
  const termin = termine.value.find(t => t.id === id);
  if (name.value && termin && termin.status === 'frei') {
    termin.status = 'gebucht';
    speichereTermin(termin);
    confirmation.value = { datum: termin.datum, zeit: termin.zeit };
  } else {
    alert('Kérem töltse ki az összes mezőt.');
  }
}

function speichereTermin(termin) {
  console.log("Gebuchter Termin:", JSON.stringify(termin, null, 2));
}

async function saveSlot() {
  try {
    const startDate = new Date(start.value);
    const endDate = new Date(startDate.getTime() + duration.value * 60000);
    const newSlot = {
      title: title.value,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      slotClass: 'available',
      user: null
    };

    const res = await fetch('https://antaligyongyi.hu/api/booking/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSlot)
    });

    const data = await res.json();
    console.log('Slot gespeichert:', data);
    admindialog.value = false;
    await ladeTermine(); // neu laden
  } catch (err) {
    console.error('Fehler beim Speichern des Slots:', err);
  }
}

</script>


<style scoped>
.frei {
  color: green;
}
.gebucht {
  color: red;
}
</style>
