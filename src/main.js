import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import moment from "moment";
import axios from 'axios'
import qs from 'qs'
import JsonExcel from 'vue-json-excel'

axios.interceptors.request.use(config => {
  //为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = localStorage.getItem("token")
  return config
})
Vue.prototype.$axios = axios
Vue.prototype.$moment = moment;
Vue.use(ElementUI);
Vue.component('downloadExcel', JsonExcel)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
