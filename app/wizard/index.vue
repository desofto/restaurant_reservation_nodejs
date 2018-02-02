<template>
  <div class="wizard">
    <div class="steps">
      <div class="step">
        <div class="element" :class="{ active: step >= 1 }" @click="setStep(1)">
          1
        </div>
        <div class="caption">
          select a count of guest
        </div>
      </div>
      <div class="step">
        <div class="element" :class="{ active: step >= 2 }" @click="setStep(2)">
          2
        </div>
        <div class="caption">
          select date and time
        </div>
      </div>
      <div class="step">
        <div class="element" :class="{ active: step >= 3 }" @click="setStep(3)">
          3
        </div>
        <div class="caption">
          fill name and phone number and email
        </div>
      </div>
      <div class="step">
        <div class="element" :class="{ active: step >= 4 }" @click="setStep(4)">
          4
        </div>
        <div class="caption">
          confirm
        </div>
      </div>
    </div>
    <div class="content text-center">
      <div v-if="step == 1">
        <step1 v-model="guests" @next="next()" />
      </div>
      <div v-if="step == 2">
        <step2 @next="next()" />
      </div>
      <div v-if="step == 3">
        <step3 @next="next()" />
      </div>
      <div v-if="step == 4">
        <step4 @next="next()" />
      </div>
    </div>
  </div>
</template>

<script>
  import Step1 from './step_1.vue'
  import Step2 from './step_2.vue'
  import Step3 from './step_3.vue'
  import Step4 from './step_4.vue'

  export default {
    data() {
      return {
        step: 1
      }
    },

    computed: {
      guests: {
        get() {
          return this.$store.state.reservation.guests
        },

        set(value) {
          this.$store.commit('reservation/guests', value)
        }
      }
    },

    methods: {
      setStep(step) {
        if(step > this.step) return
        this.step = step
      },

      next() {
        this.step++
      }
    },

    components: {
      step1: Step1,
      step2: Step2,
      step3: Step3,
      step4: Step4
    }
  }
</script>

<style lang="scss" scoped>
  .wizard {
    width: 100%;
    height: 100%;

    .steps {
      background-color: #f4a57c;
      float: left;

      .step {
        float: left;
        padding: 0.9rem;

        .element {
          float: left;
          margin: 1rem;
          background-color: #d9d6d6;
          border: 4px solid #d9d6d6;
          color: #f4a57c;
          width: 1.7em;
          height: 1.7em;
          border-radius: 1.7em;
          text-align: center;
          font-size: 26px;

          &.active {
            cursor: pointer;
            background-color: white;
            border: 4px solid white;
          }
        }

        .caption {
          color: white;
          float: left;
          margin-top: 2rem;
          font-weight: bold;
          display: none;
        }
      }
    }

    .content {
      width: auto;
      height: 100%;
      padding-top: 1rem;
    }
  }

  @media (max-width: 767px) {
    .wizard {
      .steps, .content {
        clear: both;
        width: 100%;
      }

      .steps .step {
        width: 25%;

        .element {
          float: none;
          margin: auto auto;
        }
      }
    }
  }

  @media (min-width: 768px) {
    .wizard {
      .steps {
        width: 10rem;
        height: 100vh;

        .step {
          clear: both;
        }
      }

      .content {
        margin-left: 10rem;
      }
    }
  }

  @media (min-width: 992px) {
    .wizard {
      .steps {
        width: 30rem;

        .step .caption {
          display: initial;
        }
      }

      .content {
        margin-left: 30rem;
      }
    }
  }

  @media (min-width: 1200px) {
  }
</style>

<style lang="scss">
  .wizard .content h4 {
    text-transform: uppercase;
    text-align: center;
    color: #f4a57c;
    font-weight: bold;
  }

  .btn-next {
    margin-top: 2rem;
    width: 100%;

    button {
      border-radius: 1rem;
      padding: 1rem 0;
      border: 2px #9a9a9a solid;
      color: white;
      font-weight: bold;
      background-color: #a9a9a9;
      width: 22rem;

      &:hover {
        margin-top: initial !important;
        border-bottom-width: 2px !important;
      }
    }
  }
</style>
