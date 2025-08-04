import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from './services/router'
import { createPinia } from 'pinia'
//import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

loadFonts()

const app = createApp(App)
app.use(vuetify)
app.use(router)
app.use(createPinia())
//app.use(toast)
app.mount('#app')
