<template>
  <div class="form-inline">
    <h4>Your info</h4>

    <div class="group">
      <div class="pull-left col-sm-6 col-xs-12 text-label">
        <label class="control-label">Guests:</label>
      </div>
      <div class="pull-left col-sm-6 col-xs-12 text-uppercase" :class="{ warning: reservation.seats < reservation.guests }">
        {{ reservation.seats }} person
      </div>
    </div>

    <div class="group">
      <div class="pull-left col-sm-6 col-xs-12 text-label">
        <label class="control-label">Date:</label>
      </div>
      <div class="pull-left col-sm-6 col-xs-12 text-uppercase">
        {{ reservationDate() }}
      </div>
    </div>

    <div class="group">
      <div class="pull-left col-sm-6 col-xs-12 text-label">
        <label class="control-label">Name:</label>
      </div>
      <div class="pull-left col-sm-6 col-xs-12">
        {{ identification.name }}
      </div>
    </div>

    <div class="group">
      <div class="pull-left col-sm-6 col-xs-12 text-label">
        <label class="control-label">Phone number:</label>
      </div>
      <div class="pull-left col-sm-6 col-xs-12">
        {{ identification.phone }}
      </div>
    </div>

    <div class="group">
      <div class="pull-left col-sm-6 col-xs-12 text-label">
        <label class="control-label">Email:</label>
      </div>
      <div class="pull-left col-sm-6 col-xs-12">
        {{ identification.email }}
      </div>
    </div>

    <div class="btn-next">
      <button class="btn text-uppercase" @click="reserve()">
        Next
      </button>
    </div>
  </div>
</template>

<script>
  import VueStripeCheckout from 'vue-stripe-checkout'

  Vue.use(VueStripeCheckout, {
    key: 'pk_test_EAj5BTkLoiJS3DWC3O6M4q78',
    locale: 'auto'
  })

  export default {
    data() {
      return {
      }
    },

    computed: {
      reservation() {
        return this.$store.state.reservation
      },

      identification() {
        return this.$store.state.identification
      }
    },

    methods: {
      reservationDate() {
        return (new Date(this.reservation.date.year, this.reservation.date.month-1, this.reservation.date.day)).toLocaleString("en-us", { year: "numeric", month: "long", day: "2-digit" })
      },

      reserve() {
        let data = {
          reservation: {
            guests: this.reservation.seats,
            date: {
              year: this.reservation.date.year,
              month: this.reservation.date.month,
              day: this.reservation.date.day,
              hour: this.reservation.date.hour
            }
          },
          identification: {
            name: this.identification.name,
            phone: this.identification.phone,
            email: this.identification.email,
            password: this.identification.password
          }
        }
        this.$http.post('/api/v1/reservations', data).then(response => {
          this.checkout(response.data)
        }, error => {
          alert(error.body)
        })
      },

      checkout(reservation) {
        let self = this
        this.$checkout.open({
          name: `A table for ${this.reservation.seats} person on ${this.reservationDate()}`,
          currency: 'USD',
          amount: 100,
          panelLabel: 'Pay {{amount}}',
          token(token) {
            self.$http.post(`/api/v1/reservations/${reservation.id}/pay`, { token: token.id }).then(response => {
              alert('Reserved')
            }, error => {
              alert(error.body)
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .form-inline .warning {
    color: red;
  }

  .group {
    width: 100%;
    margin-top: 1rem;
    display: inline-block;
  }

  .text-label {
    text-transform: uppercase;
    text-align: left;
  }
</style>
