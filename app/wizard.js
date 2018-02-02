import Wizard from './wizard/index.vue'

document.addEventListener('DOMContentLoaded', () => {
  const store = new Vuex.Store({
    modules: {
      reservation: {
        namespaced: true,

        state: {
          guests: 2,
          seats: 0,
          date: {
            year: (new Date).getFullYear(),
            month: (new Date).getMonth() + 1,
            day: (new Date).getDate(),
            hour: null //12
          }
        },

        mutations: {
          guests(state, count) {
            state.guests = count
          },

          seats(state, count) {
            state.seats = count
          },

          date(state, date) {
            state.date = date
          }
        }
      },

      identification: {
        namespaced: true,

        state: {
          name: '', //'John Smith',
          phone: '', //'+1234567890',
          email: '', //'test@gmail.com',
          password: ''//'qweQWE123'
        },

        mutations: {
          name(state, value) {
            state.name = value
          },

          phone(state, value) {
            state.phone = value
          },

          email(state, value) {
            state.email = value
          },

          password(state, value) {
            state.password = value
          }
        }
      }
    }
  })

  const app = new Vue({
    el: 'app',
    template: '<wizard />',

    components: {
      wizard: Wizard
    },

    store
  })
})
