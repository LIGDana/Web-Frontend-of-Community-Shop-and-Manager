import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //后端访问总接口
    baseurl:'https://Community-Merchant-Server-BUGKILLER.app.secoder.net/managers',

    //管理员基础信息
    info: {
      id: 0,
      password: '',
      alpha: 0, //用户获得积分比例上限
      beta: 0, //用户使用积分比例上限
      effectiveTime: 365, // (days)消费额对等级的有效时间
      money1: 0,
      money2: 0,
      money3: 0,
      money4: 0,
      alpha0: 0,
      alpha1: 0,
      alpha2: 0,
      alpha3: 0,
      alpha4: 0,
    },
    token: '',
  },
  mutations: {

  },
  actions: {

  }
})
