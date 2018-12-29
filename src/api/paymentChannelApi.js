import {
  default as fetch,
  util
} from "./fetch";

export default {
  // 获取支付渠道列表
  getList(data) {
    return fetch({
      url: `/paymentChannelInfo/list`,
      method: 'post',
      data
    })
  },
  // 更新支付渠道状态
  updateStatus(data) {
    return fetch({
      url: `/paymentChannelInfo/updateStatus`,
      method: 'get',
      data
    })
  },
  // 新增支付渠道
  create(data) {
    return fetch({
      url: `/paymentChannelInfo/add`,
      method: 'post',
      data
    })
  },
  // 更新支付渠道
  update(data) {
    return fetch({
      url: `/paymentChannelInfo/update`,
      method: 'post',
      data
    })
  },
  // 删除支付渠道
  delete(data) {
    return fetch({
      url: `/paymentChannelInfo/del`,
      method: 'post',
      data
    })
  },
  // 获取支付渠道详情
  details(data) {
    return fetch({
      url: `/paymentChannelInfo/get/${data}`,
      method: 'post'
    })
  }
}