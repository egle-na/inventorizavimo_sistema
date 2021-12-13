import Vue from 'vue'
import App from './App.vue'
import router from "@/router/router"

import axios from "axios";
Vue.prototype.$http = axios;

Vue.config.productionTip = false;

// export const EventBus = new Vue();

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
