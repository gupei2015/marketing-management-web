import {
  default as fetch,
  util
} from "./fetch";

export default {
  // 获取应用列表
  getList(data) {
    return fetch({
      url: `/appInfo/query`,
      method: 'post',
      data
    })
  },
  // 更新应用
  update(data) {
    return fetch({
      url: `/appInfo/update`,
      method: 'put',
      data
    })
  },
  // 新建应用
  create(data) {
    return fetch({
      url: `/appInfo/save`,
      method: 'post',
      data
    })
  },
  // 删除应用
  delete(data) {
    return fetch({
      url: `/appInfo/delete/${data}`,
      method: 'delete'
    })
  },
  // 获取应用key、secret
  getAppKeySecret(data) {
    return fetch({
      url: `/apiSign/genAppKeySecret`,
      method: 'post',
      data
    })
  },
  // 获取平台公钥，私钥
  getRsa2Key(data) {
    return fetch({
      url: `/apiSign/genRsa2Key`,
      method: 'post',
      data
    })
  }
}