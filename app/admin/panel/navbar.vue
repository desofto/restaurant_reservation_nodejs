<template>
  <nav class="navbar navbar-dark">
    <a class="navbar-brand" href="/">Reservation System</a>
    <span class="navbar-text">
      {{ user.email }}
      <button @click.prevent="logout()" class="btn btn-logout btn-primary btn-sm">Logout</button>
    </span>
  </nav>
</template>

<script>
  export default {
    props: {
      user: {
        type: Object
      }
    },

    methods: {
      logout() {
        this.$http.post('/api/v1/users/logout?token=' + this.user.token).then(response => {
          this.$emit('logout')
        }, (error) => {
          this.$emit('logout')
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  nav {
    background: #212529 !important;
    color: #d7d7d7;
    border: 0;

    .btn-logout {
      border: 0;

      &:hover {
        margin-top: 0;
      }
    }
  }
</style>
