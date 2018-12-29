
import {
  default as fetch,
  util
} from "./fetch";

export default {
  // 获取商户列表
  getMerchantList(data) {
    console.log(data)
    return fetch({
      url: '/backend/couponManagement/queryCoupon',
      method: 'post',
      data
    })
  },
  // 保存商户信息
  saveMerchant(data) {
    console.log(data)
    return fetch({
      url: '/backend/couponManagement/saveCoupon',
      method: 'post',
      // headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      data
    })
  },
  // 获取商户详情
  getMerchantDetails(params) {
    console.log(params)
    return fetch({
      url: `/merchant/detail/${params}`,
      method: 'get'
    })
  },
  // 删除商户
  deleteMerchant(params) {
    return fetch({
      url: `/backend/couponManagement/deleteCoupon/${params}`,
      method: 'delete'
    })
  },
  // 获取商户支付配置列表
  getMerchantPaySettingList(data) {
    return fetch({
      url: '/merchant/cfg/search',
      method: 'post',
      data
    })
  },
  // 保存商户支付配置信息
  saveMerchantPaySetting(data) {
    return fetch({
      url: '/merchant/cfg/save',
      method: 'post',
      data
    })
  },
  // 获取下商户支付配置信息详情
  getMerchantPSDetails(data) {
    return fetch({
      url: `/merchant/cfg/detail/${data.merchantId}`,
      method: 'get',
      params: {
        paymentChannel: data.paymentChannel
      }
    })
  },
  // 删除商户支付配置(根据支付渠道来分类)
  deleteMerchantPaySetting(params) {
    return fetch({
      url: `/merchant/cfg/delete/${params}`,
      method: 'delete'
    })
  },
  // 商户支付配置微信上传证书
  uploadCert(params, data) {
    return fetch({
      url: `/merchant/cfg/cert/upload`,
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      params,
      data
    })
  }
};