<template>
  <div class="form-inline">
    <h4>Your info</h4>

    <div class="group form-group">
      <div class="col-lg-6 col-md-12">
        <div class="group form-group">
          <div class="col-md-6 col-xs-12 text-label">
            <label for="name" class="form-control-label">Name:</label>
          </div>
          <div class="col-md-6 col-xs-12">
            <input id="name" class="form-control" v-model="name" :class="{ 'is-invalid': errors.name }">
          </div>
        </div>
      </div>
      <div class="col-lg-6 col-md-12">
        <div class="group form-group">
          <div class="col-md-6 col-xs-12 text-label">
            <label for="phone" class="form-control-label">Phone number:</label>
          </div>
          <div class="col-md-6 col-xs-12">
            <input id="phone" class="form-control" v-model="phone" :class="{ 'is-invalid': errors.phone }">
          </div>
        </div>
      </div>
    </div>

    <div class="group form-group">
      <div class="col-lg-6 col-md-12">
        <div class="group form-group">
          <div class="col-md-6 col-xs-12 text-label">
            <label for="email" class="form-control-label">Email:</label>
          </div>
          <div class="col-md-6 col-xs-12">
            <input id="email" class="form-control" v-model="email" :class="{ 'is-invalid': errors.email }">
          </div>
        </div>
      </div>

      <div class="col-lg-6 col-md-12">
        <div class="group form-group">
          <div class="col-md-6 col-xs-12 text-label">
            <label for="password" class="form-control-label">Password:</label>
          </div>
          <div class="col-md-6 col-xs-12">
            <input type="password" id="password" class="form-control" v-model="password" :class="{ 'is-invalid': errors.password }">
          </div>
        </div>
      </div>
    </div>

    <div class="group" style="display: inline-block; margin-top: 2rem;">
      <a>already has account?</a>
    </div>

    <div class="btn-next">
      <button class="btn text-uppercase" @click="checkForm()">
        Next
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        errors: {
          name: false,
          phone: false,
          email: false,
          password: false
        }
      }
    },

    computed: {
      name: {
        get() { return this.$store.state.identification.name },
        set(value) { this.$store.commit('identification/name', value) }
      },

      phone: {
        get() { return this.$store.state.identification.phone },
        set(value) { this.$store.commit('identification/phone', value) }
      },

      email: {
        get() { return this.$store.state.identification.email },
        set(value) { this.$store.commit('identification/email', value) }
      },

      password: {
        get() { return this.$store.state.identification.password },
        set(value) { this.$store.commit('identification/password', value) }
      }
    },

    methods: {
      checkForm() {
        let hasError = false

        this.errors.name = this.name.length < 1
        hasError = hasError || this.errors.name

        this.errors.phone = this.phone.length < 1
        hasError = hasError || this.errors.phone

        this.errors.email = this.email.length < 1
        hasError = hasError || this.errors.email

        this.errors.password = this.password.length < 1
        hasError = hasError || this.errors.password

        if(hasError) return

        this.$emit('next')
      }
    },
  }
</script>

<style scoped>
  .group {
    width: 100%;
    margin-top: 1rem;
  }

  .text-label {
    text-transform: uppercase;
  }

  @media (max-width: 767px) {
    .text-label {
      text-align: left;
    }
  }

  @media (min-width: 768px) {
    .text-label {
      text-align: left;
    }
  }

  @media (min-width: 992px) {
    .text-label {
      text-align: right;
    }
  }

  @media (min-width: 1200px) {
  }
</style>
