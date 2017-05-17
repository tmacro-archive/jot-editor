// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Jot from './Jot'
import router from './router'
import Vuetify from 'vuetify'
import VueLocalStorage from 'vue-localstorage'

Vue.use(Vuetify)
Vue.use(VueLocalStorage)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#jot',
  router,
  template: '<Jot/>',
  components: { Jot }
})
