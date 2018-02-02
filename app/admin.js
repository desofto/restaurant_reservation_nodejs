import Admin from './admin/index.vue'

document.addEventListener('DOMContentLoaded', () => {
  const store = new Vuex.Store({
    state: {
      user: null
    },

    mutations: {
      login(state, user) {
        state.user = user
      },

      logout(state) {
        state.user = null
      }
    },

    actions: {
      authenticate(context) {
        return new Promise((resolve, reject) => {
          if(context.state.user) {
            resolve(context.state.user)
          } else {
            reject()
          }
        })
      }
    }
  })

  const app = new Vue({
    el: 'app',
    template: '<admin />',

    components: {
      admin: Admin
    },

    created() {
      this.$store.commit('login', this.$ls.get('user'))
    },

    store
  })
})
