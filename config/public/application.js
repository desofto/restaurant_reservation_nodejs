webpackJsonp([4],{

/***/ 11:
/***/ (function(module, exports) {

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueLocalStorage, { namespace: 'restaurant_reservation' })

document.addEventListener('DOMContentLoaded', () => {
  let csrfToken = document.querySelector('meta[name="csrf-token"]')
  if(csrfToken) {
    Vue.http.headers.common['X-CSRF-Token'] = csrfToken.getAttribute('content')
  }
})


/***/ })

},[11]);