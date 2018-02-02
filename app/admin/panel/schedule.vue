<template>
  <div class="schedule">
    <div v-if="error" class="alert alert-warning">
      {{ error }}
    </div>

    <div class="panel panel-default" style="width: 100%">
      <div class="panel-heading"><h1>Calendar</h1></div>
      <table class="table table-bordered table-striped table-hover">
        <thead>
          <tr>
            <th>Date</th>
            <th>Total seat</th>
            <th>Available seat</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in schedule">
            <td>{{ item.date }}</td>
            <td>{{ item.count }}</td>
            <td>{{ item.free_seats }}</td>
            <td></td>
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
        schedule: []
      }
    },

    mounted() {
      /*
      App.cable.subscriptions.create({ channel: 'ReservationsChannel', token: this.user.token }, {
        received: (data) => {
          this.load_schedule()
        }
      })
      */

      this.load_schedule()
    },

    methods: {
      load_schedule() {
        this.$http.get('/api/v1/schedule?token=' + this.user.token).then(response => {
          this.schedule = response.body
        }, (error) => {
          this.error = error.body.errors
        })
      }
    }
  }
</script>

<style scoped>
</style>
