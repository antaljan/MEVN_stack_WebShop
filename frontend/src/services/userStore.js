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
      localStorage.setItem('jwt', token)
      localStorage.setItem('user', JSON.stringify({ name: user.name, role: user.role }));
    },
    logout() {
      this.name = null
      this.role = null
      this.token = null
      this.isLoggedIn = false
      localStorage.removeItem('jwt')
      localStorage.removeItem('user')
    },
    async restoreSession() {
      const token = localStorage.getItem('jwt')
      const user = JSON.parse(localStorage.getItem('user'));
      if (token) {
        this.token = token
        this.isLoggedIn = true
        this.name = user ? user.name : null
        this.role = user ? user.role : null
      }
    }
  },
  persist: true
})

