class request {
  constructor() {
    this._data = {
      body: {
        clinicId: "90000",
        roleType: "1"
      },
      header: {
        osType: "minWechat",
        timeStamp: new Date().getTime(),
        version: "1.0.00"
      },
      tokenOverFlag: true
    }
  }
  header() {
    let header = {};
    if (wx.getStorageSync('token')) {
      header = {
        authorization: 'Bearer ' + wx.getStorageSync('token'),
      }
    }
    return header;
  }
  /*
  *设置统一的异常处理
  */
  setErrorHandler(handler) {
    this._errorHandler = handler;
  }
  /*
 *设置统一的异常处理
 */
  getRequest(url, data, header = this.header()) {
    Object.assign(data.body, this._data.body, { roleId: wx.getStorageSync('userId') });
    Object.assign(data.header, this._data.header);
    header = this._header;
    return this.requestAll(url, data, header, 'GET')
  }

  /**
  * DELETE类型的网络请求
  */
  deleteRequest(url, data, header = this.header()) {
    Object.assign(data.body, this._data.body, { roleId: wx.getStorageSync('userId') });
    Object.assign(data.header, this._data.header);
    return this.requestAll(url, data, header, 'DELETE')
  }

  /**
   * PUT类型的网络请求
   */
  putRequest(url, data, header = this.header()) {
    Object.assign(data.body, this._data.body, { roleId: wx.getStorageSync('userId') });
    Object.assign(data.header, this._data.header);
    return this.requestAll(url, data, header, 'PUT')
  }

  /**
   * POST类型的网络请求
   */
  postRequest(url, data, header = this.header()) {
    Object.assign(data.body, this._data.body, { roleId: wx.getStorageSync('userId') });
    Object.assign(data.header, this._data.header);
    return this.requestAll(url, data, header, 'POST')
  }
  /**
  * 网络请求
  */
  requestAll(url, data, header, method) {

    for (let i in data) {
      if (!data[i]) {
        delete data[i]
      }
    }

    return new Promise((resolve, reject) => {
      let aa = wx.request({
        url: url,
        data: data,
        header: header,
        method: method,
        success: (res => {

          if (res.statusCode === 200) {
            //200: 服务端业务处理正常结束
            resolve(res);
            setTimeout(()=>{
              this._data.tokenOverFlag = true;
            },15000)
            return false;
          } else {
            //其它错误，提示用户错误信息
            if (this._errorHandler != null) {
              //如果有统一的异常处理，就先调用统一异常处理函数对异常进行处理
              this._errorHandler(res)
            }
            reject(res)
          }

          //token过期处理
          if (res.statusCode == 401) {
            //token过期拦截多次提示时使用
            if (!this._data.tokenOverFlag){
              console.log(2111);
              return false;
            }
            this._data.tokenOverFlag = false;

            let phone = wx.getStorageSync('phone');
            let openid = wx.getStorageSync('openid');
            aa.abort();
            //let unionid = wx.getStorageSync('unionid');
            if (phone && openid) {
             
              getApp().getTokenRequest(phone, function () {
                wx.setStorageSync('phone', phone);   
                //获取当前路由
                let currentRouter = getCurrentPages();
                let route = currentRouter[currentRouter.length - 1].route;
                //匹配不需要跳转首页的路由
                let noJumpPage = getApp().globalData.noJumpIndex;
                for(let i in noJumpPage){
                  if(noJumpPage[i] == route){
                    return false;
                  }
                }    
                wx.reLaunch({
                  url: '/pages/index/index'
                });
              });
            } else {  //其他页面跳转首页(兼容部分信息被微信删除)
              wx.reLaunch({
                url: '/pages/index/index',
                complete: function(){
                   wx.clearStorageSync();
                }
              });
            }  
          }
        }),
        fail: (res => {
          if (this._errorHandler != null) {
            this._errorHandler(res)
          }
          reject(res)
        })
      })
    })
  }
}
export default request
