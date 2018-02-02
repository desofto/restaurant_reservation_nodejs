<template>
  <div>
    <h4>How many person?</h4>

    <div class="grid-container">
      <div class="grid-cell" v-for="index in 8" :class="{ active: current_guests == index }" @click="setGuests(index)">
        {{ index }}
      </div>
    </div>
    <div class="show-more" v-on:click="toggleShowMore()">
      more
    </div>
    <div v-if="showMore">
      <div class="form-group">
        <select class="form-control guests-count" :value="current_guests" @change="setGuests($event.target.value)">
          <option v-for="index in 20" :value="index">
            {{ index }}
          </option>
        </select>
      </div>
    </div>

    <div class="btn-next">
      <button class="btn text-uppercase" @click="$emit('next')">
        Next
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    model: {
      prop: 'guests',
      event: 'update'
    },
    props: {
      guests: {
        type: [Number, String],
        required: true
      }
    },
    data() {
      return {
        current_guests: this.guests,
        showMore: false
      }
    },
    mounted() {
      this.showMore = this.current_guests > 8
    },
    methods: {
      setGuests(guests) {
        this.current_guests = guests
        this.$emit('update', guests)
      },
      toggleShowMore() {
        this.showMore = !this.showMore
      }
    }
  }
</script>

<style lang="scss" scoped>
  .grid-container {
    text-align: center;
    padding: 1.5rem;
    width: 24rem;
    height: 13rem;
    margin: auto;

    .grid-cell {
      cursor: pointer;
      width: 4rem;
      height: 4rem;
      padding: 0.2rem;
      font-weight: bold;
      margin-bottom: 1rem;
      margin-right: 1rem;
      float: left;
      border: 4px solid #f9f6f2;
      border-radius: 3px;
      background: #f9f6f2;
      color: #a9a9a9;
      font-size: xx-large;

      &.active {
        border: 4px solid #f4a57c;
      }
    }
  }

  .show-more {
    font-size: x-large;
    cursor: pointer;
    color: #a9a9a9;
  }

  select.guests-count {
    margin-top: 2rem;
    margin-left: auto;
    margin-right: auto;
    width: 22rem;
  }

  @media (min-width: 768px) {
    .grid-container {
      padding: 2rem;
      height: 17rem;
      width: 33rem;
    }

    .grid-container .grid-cell {
      width: 6rem;
      height: 6rem;
      padding: 1rem;
    }
  }
</style>
