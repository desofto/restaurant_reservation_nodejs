webpackJsonp([5],{

/***/ 12:
/***/ (function(module, exports) {

document.addEventListener('DOMContentLoaded', () => {
  const app = new Vue({
    el: document.querySelector('app'),

    data() {
      return {
        scrollPosition: 0
      }
    },

    created() {
      window.addEventListener('scroll', this.scrolled)
    },

    destroyed() {
      window.removeEventListener('scroll', this.scrolled)
    },

    mounted() {
      this.scrolled()
    },

    methods: {
      scrollTo(id) {
        let target = document.querySelector(id)
        $('html, body').animate({
          scrollTop: target.offsetTop - 54
        }, 1000, "easeInOutExpo")
      },

      scrolled() {
        this.scrollPosition = window.scrollY
      }
    }
  })
})


/***/ })

},[12]);