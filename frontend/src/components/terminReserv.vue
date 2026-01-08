<template>
  <v-container class="form-container" max-width="600">
    <v-form @submit.prevent>
      <v-card elevation="2" class="pa-4">
        <v-card-title>Időpont foglalás</v-card-title>
        <v-card-text>
          <v-text-field label="vezeték név:" v-model="name" required />
          <v-text-field label="kereszt név:" v-model="firsName" required />
          <v-text-field label="email:" v-model="email" required />

          <!-- Dátumválasztó -->
          <v-menu
            v-model="menu"
            :close-on-content-click="true"
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
              />
            </template>

            <v-date-picker
              v-model="selectedDate"
              :allowed-dates="verfuegbareDaten"
              @input="menu = false"
              locale="de"
            />
          </v-menu>

          <!-- Időpontok listája -->
          <div v-if="gefilterteTermine.length">
            <h3 class="mt-4">Elérhető időpontok:</h3>
            <v-list>
              <v-list-item
                v-for="termin in gefilterteTermine"
                :key="termin.id"
              >
                <v-list-item-title>
                  {{ termin.datum }} um {{ termin.zeit }} -
                  <strong :class="termin.status">{{ termin.status }}</strong>
                </v-list-item-title>

                <v-list-item-action v-if="termin.status === 'frei'">
                  <v-btn icon @click="bucheTermin(termin)">
                    <v-icon>mdi-calendar-plus</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </div>

          <!-- Foglalás visszaigazolás -->
          <div v-if="confirmation" class="mt-4">
            <v-alert type="success" border="start" elevation="2">
              <p>Köszönöm szépen <strong>{{ name }}</strong>! Az időpontot sikeresen lefoglalta.</p>
              <p><strong>Dátum:</strong> {{ confirmation.datum }}</p>
              <p><strong>Időpont:</strong> {{ confirmation.zeit }}</p>
            </v-alert>
          </div>
        </v-card-text>
      </v-card>
    </v-form>

    <!-- Admin: új időpont -->
    <v-btn color="primary" class="mt-4" @click="admindialog = true">
      Új időpont hozzáadása
    </v-btn>

    <v-dialog v-model="admindialog" max-width="500">
      <v-card>
        <v-card-title>Új időpont létrehozása</v-card-title>
        <v-card-text>
          <v-text-field label="Cím" v-model="title" />
          <v-text-field label="Kezdés (pl. 2026-01-09T14:00)" v-model="start" />
          <v-text-field label="Időtartam (perc)" v-model="duration" type="number" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="green" @click="saveSlot">Mentés</v-btn>
          <v-btn color="red" @click="admindialog = false">Mégse</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const name = ref("");
const firstName = ref("");
const email = ref("");
const selectedDate = ref("");
const menu = ref(false);
const confirmation = ref(null);
const termine = ref([]);

const admindialog = ref(false);
const title = ref("");
const start = ref("");
const duration = ref(60);

// Helper: YYYY-MM-DD formátum
function formatDateYMD(date) {
  if (typeof date === "string") return date;
  if (date instanceof Date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return null;
}

onMounted(async () => {
  await ladeTermine();
});

// Időpontok betöltése
async function ladeTermine() {
  try {
    const res = await fetch("https://antaligyongyi.hu/api/booking/all");
    const data = await res.json();
    termine.value = data.map(event => ({
      id: event._id,
      title: event.title,
      start: event.start,
      end: event.end,
      datum: event.start.split("T")[0],
      zeit: event.start.split("T")[1]?.substring(0, 5),
      status: event.slotClass === "available" ? "frei" : "gebucht",
      user: event.user
    }));
    console.log("Termine geladen:", termine.value);
  } catch (err) {
    console.error("Fehler beim Laden der Termine:", err);
  }
}

// Csak a kiválasztott nap időpontjai
const gefilterteTermine = computed(() => {
  if (!selectedDate.value) return [];
  const selected = formatDateYMD(selectedDate.value);
  return termine.value.filter(t => t.datum === selected);
});

// Csak azok a napok választhatók, ahol van "frei"
const verfuegbareDaten = (date) => {
  const d = formatDateYMD(date);
  return termine.value.some(t => t.status === "frei" && t.datum === d);
};

// Foglalás
async function bucheTermin(termin) {
  if (!name.value) {
    alert("Kérem adja meg a nevét.");
    return;
  }
  try {
  const res = await fetch(`https://antaligyongyi.hu/api/booking/${termin.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: termin.title,
      start: termin.start,
      end: termin.end,
      slotClass: "booked",
      user: {
        name: name.value,
        firstname: firstName.value,
        email: email.value
      }
    })
  });
  const data = await res.json();
  console.log("Foglalás mentve:", data);
  confirmation.value = { datum: termin.datum, zeit: termin.zeit };
  await ladeTermine();
  } catch (err) {
    console.error("Foglalási hiba:", err);
  }
}

// Új időpont létrehozása
async function saveSlot() {
  try {
    const startDate = new Date(start.value);
    const endDate = new Date(startDate.getTime() + duration.value * 60000);
    const newSlot = {
      title: title.value,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      slotClass: "available",
      user: null
    };
    const res = await fetch("https://antaligyongyi.hu/api/booking/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSlot)
    });
    const data = await res.json();
    console.log("Slot gespeichert:", data);
    admindialog.value = false;
    await ladeTermine();
  } catch (err) {
    console.error("Fehler beim Speichern des Slots:", err);
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
