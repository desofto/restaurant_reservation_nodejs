<template>
  <div class="account">
    <div v-if="error" class="alert alert-warning">
      {{ error }}
    </div>

    <div class="panel panel-default">
      <div class="panel-heading"><h1>Account</h1></div>
      <table class="table table-bordered table-striped table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(u, index) in users">
            <td>{{ 1+index }}</td>
            <td>{{ u.name }}</td>
            <td>{{ u.role }}</td>
            <td>
              <a href v-if="user.role == 'admin'" @click.prevent="remove(u)">delete</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      user: {
        type: Object,
        required: true
      }
    },

    data() {
      return {
        error: null,
        users: []
      }
    },

    mounted() {
      this.$http.get('/api/v1/users?token=' + this.user.token).then(response => {
        this.users = response.body
      }, (error) => {
        if(error.status == 401) {
          this.$parent.$emit('logout')
        } else {
          this.error = error.body
        }
      })
    },

    methods: {
      remove(user) {
        this.$http.delete('/api/v1/users/' + user.id + '?token=' + this.user.token).then(response => {
          let index = this.users.indexOf(user)
          this.users.splice(index, 1)
        }, (error) => {
          if(error.status == 401) {
            this.$parent.$emit('logout')
          } else {
            this.error = error.body
          }
        })
      }
    }
  }
</script>

<style scoped>
</style>
