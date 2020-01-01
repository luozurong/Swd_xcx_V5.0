import request from './request.js';
import baseUrl from './baseUrl.js';
class BigApi {
  constructor() {
    this._baseUrl = baseUrl;
    this._defaultHeader = {
      'Content-Type': 'application/json'
    };
    this._request = new request;
    this._request.setErrorHandler(this.errorHander)
  }

  /**
   * 获取用户登录授权token，userId
   */
  getLoginInfo() {
    this._request._data.body.roleId = wx.getStorageSync('userId') || '';
    this._request._header = {
      authorization: 'Bearer ' + wx.getStorageSync('token') || '',
    }
  }

  /**
   * 统一的异常处理方法
   */
  errorHander(res) {
    console.error(res)
  }

  /**
   * 数据接口
   */
  getAddressList(data) { // 获取收货地址列表
    return this._request.postRequest(this._baseUrl + '/mall/appMall/getReciveSite', data).then(res => res.data).catch(e => console.log(e))
  }
}

export default BigApi