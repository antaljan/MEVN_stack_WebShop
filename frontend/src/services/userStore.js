import { defineStore } from 'pinia'
import axios from 'axios'

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
      localStorage.setItem('email', user.email)
    },
    logout() {
      this.name = null
      this.role = null
      this.token = null
      this.isLoggedIn = false
      localStorage.removeItem('jwt')
      localStorage.removeItem('email')
    },
    async restoreSession() {
      const token = localStorage.getItem('jwt')
      const email = localStorage.getItem('email');
      if (token) {
        this.token = token
        this.isLoggedIn = true
        try {
          const response = await axios.post('https://yowayoli.com/api/restoreuser', {
            email: email
          });
          if (response.data.success) {
            this.name = response.data.user.name;
            this.role = response.data.user.role;
          } else {
            alert('Restore User not possible. Please login again.');
          }
      } catch (error) {
        alert('Error restoring user session: ' + error.message);
        return { success: false, error };
      }

      }
    }
  },
  persist: true
})

