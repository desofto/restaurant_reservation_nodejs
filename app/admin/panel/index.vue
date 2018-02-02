<template>
  <div v-if="user">
    <navbar :user="user" @logout="logout()" />

    <div class="sidebar">
      <router-link class="sidebar-item" :to="'/admin/schedule'">
        Calendar
      </router-link>
      <router-link class="sidebar-item" :to="'/admin/reservations'">
        Reservations
      </router-link>
      <router-link class="sidebar-item" :to="'/admin/account'">
        Admin Account
      </router-link>
    </div>

    <div class="main">
      <transition name="bounce" mode="out-in">
        <router-view :user="user"></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
  import Navbar from './navbar.vue'
  import Schedule from './schedule.vue'
  import Reservations from './reservations.vue'
  import Account from './account.vue'

  const routes = [
    { path: '/admin',               redirect: '/admin/schedule' },
    { path: '/admin/schedule',      component: Schedule },
    { path: '/admin/reservations',  component: Reservations },
    { path: '/admin/account',       component: Account }
  ]

  const router = new VueRouter({
    routes,
    mode: 'history'
  })

  export default {
    props: {
      user: {
        type: Object
      }
    },

    methods: {
      logout() {
        this.$emit('logout')
      }
    },

    components: {
      navbar: Navbar,
      schedule: Schedule,
      reservations: Reservations,
      account: Account
    },

    router
  }
</script>

<style lang="scss" scoped>
  .sidebar {
    float: left;
    background-color: #212529;
    color: #4a4a4a;
    width: 100%;
    text-align: center;

    .sidebar-item {
      padding: 0.5rem;
      cursor: pointer;
      border: 2px solid #212529;
      color: white;
      float: left;
      margin-left: -2px;

      &.router-link-active {
        background-color: #fec810d9;
      }

      &:hover {
        background-color: #fec810;
      }
    }
  }

  .main {
    padding: 1rem;
  }

  @media (max-width: 767px) {
  }

  @media (min-width: 768px) {
  }

  @media (min-width: 992px) {
    .sidebar {
      width: 20rem;
      height: 100vh;

      .sidebar-item {
        margin-top: -2px;
        margin-left: auto;
        padding: 2rem;
        width: 100%;
      }
    }

    .main {
      margin-left: 20rem;
    }
  }

  @media (min-width: 1200px) {
  }

  .bounce-enter {
  }

  .bounce-enter-active {
    animation: bounce-in .5s;
  }

  .bounce-enter-to {
  }

  .bounce-leave {
    display: none;
  }

  .bounce-leave-active {
    animation: bounce-out .2s;
  }

  .bounce-leave-to {
  }

  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes bounce-out {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(0);
    }
  }
</style>
