<template>
  <div>
    <h4>Select day</h4>

    <div class="box">
      <calendar :selected="new Date(reservation.date.year, reservation.date.month-1, reservation.date.day)" @select="setDate($event.day, $event.month, $event.year)" @change:month="updateSeats($event.year, $event.month, true)" :get-data="getStatus"></calendar>
    </div>

    <div class="box">
      <div v-if="reservation.date.hour != null" class="timetable">
        <div v-for="hour in timetable" class="timetable-item" @click="book(hour)" :class="{ active: hour == reservation.date.hour }">
          <div class="timetable-item-hour">
            {{ hour }}:00
          </div>
          <div class="timetable-item-status">
            <span v-html="getStatus(reservation.date.day)"></span>
          </div>
          <div class="timetable-item-seats">
            {{ Math.min(reservation.guests, seats[reservation.date.day] || 0) }} seats
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
    </div>

    <div class="btn-next">
      <button class="btn text-uppercase" @click="$emit('next')" v-if="reservation.date && reservation.date.hour">
        Next
      </button>
    </div>
  </div>
</template>

<script>
  import Calendar from '../calendar.vue'

  export default {
    data() {
      return {
        year: null,
        month: null,
        seats: [],
        timetable: [11, 12, 13, 14, 15, 16]
      }
    },

    computed: {
      reservation() {
        return this.$store.state.reservation
      }
    },

    mounted() {
      this.year = this.reservation.date.year
      this.month = this.reservation.date.month
      this.updateSeats(this.year, this.month)
    },

    methods: {
      setDate(day, month, year) {
        this.$store.commit('reservation/date', {
          year: year,
          month: month,
          day: day,
          hour: 0
        })
      },

      setHour(hour) {
        this.$store.commit('reservation/date', {
          year: this.reservation.date.year,
          month: this.reservation.date.month,
          day: this.reservation.date.day,
          hour: hour
        })
      },

      getStatus(day) {
        if(this.seats[day] >= this.reservation.guests) {
          return '<i class="fa fa-circle-o"></i>'
        } else if(this.seats[day] > 0) {
          return '<i class="fa fa-sort-asc"></i>'
        } else {
          return '--'
        }
      },

      updateSeats(year, month, resetHour = false) {
        this.year = year
        this.month = month
        if(resetHour) {
          this.setHour(null)
        }
        this.$http.get('/api/v1/schedule/' + year + '/' + month).then(response => {
          this.seats = {}
          response.body.forEach(day => {
            this.seats[day.day] = day.free_seats
          })
        })
      },

      book(hour) {
        this.$store.commit('reservation/seats', Math.min(this.reservation.guests, this.seats[this.reservation.date.day] || 0))
        if(this.reservation.seats <= 0) return
        this.setHour(hour)
      }
    },

    components: {
      calendar: Calendar
    }
  }
</script>

<style lang="scss" scoped>
  .vcom-calendar {
    margin: auto;
  }

  .timetable {
    margin: 2rem auto;
  }

  .timetable-item {
    cursor: pointer;
    background-color: #f9f9f9;
    margin-top: 0.5rem;
    padding: 1rem;

    &:hover, &.active {
      background-color: #e6e6e6;
    }
  }

  .timetable-item-hour {
    margin-top: 1rem;
    font-weight: bold;
    width: 25%;
    float: left;
  }

  .timetable-item-status {
    font-size: xx-large;
    width: 50%;
    float: left;
  }

  .timetable-item-seats {
    margin-top: 1rem;
    font-weight: bold;
    width: 25%;
    float: left;
  }

  @media (max-width: 767px) {
  }

  @media (min-width: 768px) {
  }

  @media (min-width: 992px) {
  }

  @media (min-width: 1200px) {
    .box {
      width: 50%;
      float: left;
      padding: 0 1rem;
    }
  }
</style>
