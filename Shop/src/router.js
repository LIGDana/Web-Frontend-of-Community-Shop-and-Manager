import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import ShopLogin from './views/ShopLogin.vue'
import ShopRegister from './views/ShopRegister.vue'
import ShopIndex from './views/ShopIndex.vue'
import GoodsInfo from './components/GoodsInfo.vue'
import StartTransaction from './components/StartTransaction.vue'
import MyInfo from './components/MyInfo.vue'
import TransactionHistory from './components/TransactionHistory.vue'


Vue.use(Router);

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'ShopLogin',
      component: ShopLogin
    },
    {
      path: '/register',
      name: 'ShopRegister',
      component: ShopRegister
    },
    {
      path: '/index',
      name: 'ShopIndex',
      component: ShopIndex,
      children: [
        {path:'/index/goods_info', name: 'GoodsInfo', component: GoodsInfo},
        {path:'/index/start_transaction', name: 'StartTransaction', component: StartTransaction},
        {path:'/index/my_info', name: 'MyInfo', component: MyInfo},
        {path:'/index/transaction_history', name: 'TransactionHistory', component: TransactionHistory},
      ]
    }
  ]
})


if (window.sessionStorage.getItem('store')) {
  store.replaceState(Object.assign(store.state, JSON.parse(window.sessionStorage.getItem('store'))));
}
// 在页面刷新时将store保存到sessionStorage里
window.addEventListener('beforeunload', () => {
  window.sessionStorage.setItem('store', JSON.stringify(store.state));
});

router.beforeEach((to, from, next) => {
  if(to.path === '/login' || to.path === '/register') {
    next();
  } 
  else {
    let thistoken = store.state.token;
    console.log("现在的token状态：" + thistoken)
    if(thistoken === null || thistoken === '') {
      next('/login');
    }
    else {
      next();
    }
  }
});

export default router;
