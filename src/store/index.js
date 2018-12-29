import Vue from 'vue'
import Vuex from 'vuex'
import merchant from "./modules/merchant"
import application from "./modules/application"
import paymentChannel from "./modules/paymentChannel"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
     merchant,
     application,
     paymentChannel
     }
  
})