import merchantApi from "../../api/merchantApi";

const state = {
  merchants: [],
  totalCount: -1,
  mercPageSize: 10,
  merchantPaymentSettings: [],
  merchantPaymentSettingsTotalCount: -1,
  mercPSPageSize: 10
};

const getters = {

};

const actions = {
  getMerchants({
    dispatch,
    commit,
    getters,
    rootGetters
  }, data) {
    return merchantApi.getMerchantList(data)
      .then(res => {
        console.log(res)
        if (res.data.success) {
          let pageData = res.data.data.pageData
          if(pageData.length>0){
            pageData.forEach(item => {
              item.couponType = item.couponType == 0 ? '积分': '满减'
              if (item.accumulateType == 0) {
                item.accumulateType = "排他"
              } else if (item.accumulateType == 1) {
                item.accumulateType = '并存'
              } else if (item.accumulateType == 2) {
                item.accumulateType = "择优"
              }
            })
          }
          commit('setMerchants', pageData);
          commit('setTotal', res.data.data.totalCount);
        }
        return res;
      });
  },
  getMerchantPaymentSettings({
    dispatch,
    commit,
    getters,
    rootGetters
  }, data) {
    return merchantApi.getMerchantPaySettingList(data)
      .then(res => {
        if (res.data.success) {
          commit('setMerchantPaymentSettings', res.data.data.pageData);
          commit('setMerchantPaymentSettingTotalCount', res.data.data.totalCount);
        }
        return res;
      });
  }
};

const mutations = {
  setMerchants(state, merchants) {
    state.merchants = merchants;
  },
  setTotal(state, totalCount) {
    state.totalCount = totalCount;
  },
  setMerchantPaymentSettings(state, data) {
    state.merchantPaymentSettings = data;
  },
  setMerchantPaymentSettingTotalCount(state, data) {
    state.merchantPaymentSettingsTotalCount = data;
  },
  setMercPageSize(state, data) {
    state.mercPageSize = data;
  },
  setMercPSPageSize(state, data) {
    state.mercPSPageSize = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}