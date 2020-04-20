import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import ManagerLogin from './views/ManagerLogin.vue'
import ManagerIndex from './views/ManagerIndex.vue'
import ShopInfo from './components/ShopInfo.vue'
import ResidentInfo from './components/ResidentInfo.vue'
import ShopRegisterInfo from './components/ShopRegisterInfo.vue'
import OrderInfo from './components/OrderInfo.vue'
import DiscountRule from './components/DiscountRule.vue'
import ReceivablesInfo from './components/ReceivablesInfo.vue'

Vue.use(Router)

const router =  new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'ManagerLogin',
      component: ManagerLogin
    },
    {
      path: '/index',
      name: 'ManagerIndex',
      component: ManagerIndex,
      children: [
        {path:'/index/shop_info', name: 'ShopInfo', component: ShopInfo},
        {path:'/index/resident_info', name: 'ResidentInfo', component: ResidentInfo},
        {path:'/index/register_shop_info', name: 'ShopRegisterInfo', component: ShopRegisterInfo},
        {path:'/index/discount_rule', name: 'DiscountRule', component: DiscountRule},
        {path:'/index/order_info', name: 'OrderInfo', component: OrderInfo},
        {path:'/index/receivables_info', name: 'ReceivablesInfo', component: ReceivablesInfo},
      ]
    }
  ]
});

if (window.sessionStorage.getItem('store')) {
  store.replaceState(Object.assign({}, store.state, JSON.parse(window.sessionStorage.getItem('store'))))
}
// 在页面刷新时将store保存到localStorage里
window.addEventListener('beforeunload', () => {
  window.sessionStorage.setItem('store', JSON.stringify(store.state))
});

router.beforeEach((to, from, next) => {
  if(to.path === '/login') {
    next();
  } 
  else {
    let token = store.state.token;
    if(token == null || token == '') {
      next('/login');
    }
    else {
      next();
    }
  }
});

export default router;