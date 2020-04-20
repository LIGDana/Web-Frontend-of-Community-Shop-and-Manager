import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import '../style/theme/index.css'
//import 'element-ui/lib/theme-chalk/index.css'
import './registerServiceWorker'

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(ElementUI);

axios.defaults.headers.common['token'] = store.state.token;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

axios.interceptors.request.use(
  config => {
    if(store.state.token){
      config.headers.common['token']=store.state.token;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

axios.interceptors.response.use(
  response => {
    console.log("success:" + response);
    return response;
  },
  error => {
    if (error.response) {
      console.log("myerror:" + error);
      switch (error.response.status) {
        case 500:
          router.replace({
            path: '/login',
            query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
          })
      }
    }
    return Promise.reject(error.response.data)
  }
);