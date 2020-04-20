import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    baseurl: 'https://Community-Merchant-Server-BUGKILLER.app.secoder.net/shop',
    tradeurl: 'https://Community-Merchant-Server-BUGKILLER.app.secoder.net/order',
    info: {
      shopId: 0,
      shopName:"", //String 商家店名
      ownerName:"", //String 店主姓名
      phone:"", //String 联系电话
      address:"", //String 店铺地址
      category: "", //String 经营类别
      rate: 1.0, //Double 自定义的积分换现与上限beta的比例，默认为1
      receivables:"", //Double 应收融居邻里平台的总账款（由积分换现产生）
      headImage:"" //头像
    },
    token: '',
  },
  mutations: {

  },
  actions: {

  }
})
