<template>
  <div class="reservations">
    <div v-if="error" class="alert alert-warning">
      {{ error }}
    </div>

    <div class="panel panel-default">
      <div class="panel-heading"><h1>Reservations</h1></div>
      <table class="table table-bordered table-striped table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Guest count</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone number</th>
            <th>Payment status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(reservation, index) in reservations">
            <td>{{ 1+index }}</td>
            <td>{{ format_date(reservation.date) }} {{ reservation.date.hour }}:00</td>
            <td>{{ reservation.guests }}</td>
            <td>{{ reservation.name }}</td>
            <td>{{ reservation.email }}</td>
            <td>{{ reservation.phone }}</td>
            <td>{{ reservation.status }}</td>
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
        reservations: []
      }
    },

    mounted() {
      /*
      App.cable.subscriptions.create({ channel: 'ReservationsChannel', token: this.user.token }, {
        received: (data) => {
          this.load_reservations()
        }
      })
      */

      this.load_reservations()
    },

    methods: {
      format_date(date) {
        return (new Date(date.year, date.month-1, date.day)).toLocaleString("en-us", { year: "numeric", month: "long", day: "2-digit" });
      },

      load_reservations() {
        this.$http.get('/api/v1/reservations?token=' + this.user.token).then(response => {
          this.reservations = response.body
        }, (error) => {
          this.error = error.body.errors
        })
      }
    }
  }
</script>

<style scoped>
</style>
