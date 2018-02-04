<template>
  <div class="container">
    <h4>Login</h4>

    <div class="form">
      <div v-if="errors.server" class="group alert alert-warning">
        {{ errors.server }}
      </div>

      <div class="row form-group" :class="{ 'has-error': errors.email }">
        <div class="col-sm-6 col-xs-12 text-label">
          <label for="email" class="control-label">Email:</label>
        </div>
        <div class="col-sm-6 col-xs-12">
          <input id="email" class="form-control" v-model="email">
        </div>
      </div>

      <div class="row form-group" :class="{ 'has-error': errors.password }">
        <div class="col-sm-6 col-xs-12 text-label">
          <label for="password" class="control-label">Password:</label>
        </div>
        <div class="col-sm-6 col-xs-12">
          <input type="password" id="password" class="form-control" v-model="password">
        </div>
      </div>

      <div class="row">
        <div class="offset-sm-6 col-sm-6 col-xs-12">
          <button class="btn btn-primary btn-block text-uppercase" @click="login()">
            Login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        token: null,
        email: 'test@gmail.com',
        password: 'QWEqwe123',
        errors: {
          email: false,
          password: false,
          server: false
        }
      }
    },

    methods: {
      login() {
        this.errors.server = false

        let hasError = false

        this.errors.email = this.email.length < 1
        hasError = hasError || this.errors.email

        this.errors.password = this.password.length < 1
        hasError = hasError || this.errors.password

        if(hasError) return

        let data = {
          email: this.email,
          password: this.password
        }

        this.$http.post('/api/v1/users', data).then(response => {
          this.$emit('login', response.body)
        }, (error) => {
          this.error(error.body)
        })
      },

      error(msg) {
        this.errors.server = msg

        setTimeout(() => {
          this.errors.server = false
        }, 2000)
      }
    },
  }
</script>

<style scoped>
  h4 {
    text-transform: uppercase;
    text-align: center;
    color: #f4a57c;
    font-weight: bold;
  }

  .container {
    width: auto;
    padding-top: 1rem;
    max-width: 40rem;
  }

  .row {
    margin-top: 1rem;
  }

  .text-label {
    text-transform: uppercase;
    text-align: left;
  }

  button.btn-next {
    border-radius: 1rem;
    padding: 1rem 0;
    border: 2px #9a9a9a solid;
    color: white;
    font-weight: bold;
    margin-top: 2rem;
    background-color: #a9a9a9;
    width: 22rem;
  }
</style>
