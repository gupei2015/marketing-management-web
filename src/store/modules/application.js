import applicationApi from "../../api/applicationApi";

const state = {
  list: [],
  totalCount: -1,
  pageSize: 10
};

const getters = {

};

const actions = {
  getListData({
    dispatch,
    commit,
    getters,
    rootGetters
  }, data) {
    return applicationApi.getList(data)
      .then(res => {
        if (res.data.success) {
          commit('setList', res.data.data.appInfoList);
          commit('setTotal', res.data.data.totalSize);
        }
        return res;
      });
  }
};

const mutations = {
  setList(state, list) {
    state.list = list;
  },
  setTotal(state, totalCount) {
    state.totalCount = totalCount;
  },
  setPageSize(state, data) {
    state.pageSize = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}