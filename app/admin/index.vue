<template>
  <div class="admin">
    <router-view :user="user" @login="login($event)" @logout="logout()"></router-view>
  </div>
</template>

<script>
  const routes = [
    {
      path: '/admin/login',
      component: () => import('./login.vue')
    },
    {
      path: '/admin*',
      beforeEnter(to, from, next) {
        router.app.$root.$store.dispatch('authenticate').then((user) => {
          if(user.role == 'admin' || user.role == 'operator') {
            next()
          } else {
            next('/admin/login')
          }
        }, () => {
          next('/admin/login')
        })
      },
      component: () => import('./panel/index.vue')
    },
  ]

  const router = new VueRouter({
    routes,
    mode: 'history'
  })

  export default {
    localStorage: {
      user: {
        type: Object,
        default: {}
      }
    },

    computed: {
      user: {
        get() {
          return this.$store.state.user
        },

        set(value) {
          this.$store.commit('login', value)
          this.$ls.set('user', value)
        }
      }
    },

    methods: {
      login(user) {
        this.user = user
        this.$router.push('/admin')
      },

      logout() {
        this.$router.push('/admin/login')
        this.user = null
      }
    },

    router
  }
</script>

<style scoped>
</style>
