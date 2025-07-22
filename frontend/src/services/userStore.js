import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    name: null,
    role: null,
    token: null,
    isLoggedIn: false
  }),
  actions: {
    setUser(user, token) {
      this.name = user.name
      this.role = user.role
      this.token = token
      this.isLoggedIn = true
      localStorage.setItem('jwt', token) // mentés
    },
    logout() {
      this.name = null
      this.role = null
      this.token = null
      this.isLoggedIn = false
      localStorage.removeItem('jwt')
    },
    restoreSession() {
      const token = localStorage.getItem('jwt')
      if (token) {
        this.token = token
        this.isLoggedIn = true
        // opcionálisan: dekódolás vagy API hívás a user adatokért
      }
    }
  },
  persist: true
})

