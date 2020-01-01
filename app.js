import agriknow from './apis/agriknow.js'
import BigApi from './apis/bigData.js'
import baseUrl from './apis/baseUrl.js'

App({
  onLaunch: function() {
    var that = this;
    // 展示本地存储能力loginRequest
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);

    wx.showLoading({    //很重要（防止用户快速点击）
      title: '加载中',
      mask: true
    })

    //wx.removeStorageSync('token');
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              //this.globalData.userInfo = res.userInfo;
              Object.assign(this.globalData.userInfo, res.userInfo)

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
        that.loginRequest();
      }
    })
  },

  //判断是否已经登录
  isLoginFlagFunc() {
    setTimeout(() => {
      console.log(wx.getStorageSync('userId'))
      console.log(wx.getStorageSync('openid'))
      console.log(wx.getStorageSync('token'))
      if (wx.getStorageSync('userId') && wx.getStorageSync('openid') && wx.getStorageSync('token')) {
        wx.setStorageSync('isLoginFlag', true);
        console.log('登录授权成功')
      } else {
        wx.setStorageSync('isLoginFlag', false);
        wx.navigateTo({
          url: '/pages/authorization/authorization'
        })
      }
    }, 50)
  },

  // 登录
  loginRequest() {
    let that = this;
    wx.login({
      success: res => {
        let params = {
          header: {},
          body: {
            code: res.code
          }
        }
        
        console.log(res.code);
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        let url = that.globalData.host + '/appService/wxProgram/getOpenId';
        wx.request({
          url: url,
          data: params,
          method: 'post',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.code == 0) {
              wx.setStorageSync("openid", res.data.data.openid);
              wx.setStorageSync("unionid", res.data.data.unionid);
              // wx.showLoading({
              //   title: '加载中',
              //   mask: true
              // })
              that.loginByWechat(res.data.data.openid, res.data.data.unionid);
            }
          }
        })
      }
    })
  },

  /**
   * 联享家APP跳转登录
   */
  lxjlogin(token) {
    return false;
    let that = this;
    let params = {
      header: {},
      body: {
        token: token,
        openId: wx.getStorageSync('openid')
      }
    }

    let url = that.globalData.host + '/appService/app/lxjlogin';
    wx.request({
      url: url,
      data: params,
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (!res.data.data.phone) {
          if (!wx.getStorageSync('userId') && !wx.getStorageSync('token') && !wx.getStorageSync('opendid')) {
            setTimeout(() => {
              wx.showToast({
                title: '请登录',
                icon: 'none',
              })
            }, 50);
          }
          return false;
        }
        if (res.data.code == 0) {
          that.bindWxProgramRequest(res.data.data.phone);
          if (res.data.data.phone) {
            wx.setStorageSync('phone', res.data.data.phone)
          }
        } else {
          wx.showToast({
            title: '网络延迟请重试',
            icon: 'none'
          })
        }
      }
    })
  },


  /**
   * 通过opendid或unionid获取登录信息
   */
  loginByWechat(openId, unionId) {
    let that = this;
    console.log(unionId);
    return new Promise((resolve, reject) => {
      let that = this;
      let openId = openId ? openId: wx.getStorageSync('openid') ;
      let unionId = unionId ? unionId : wx.getStorageSync('unionid');
      let params = {
        header: {},
        body: {
          openId: openId,
          unionId: unionId
        }
      }

      let url = that.globalData.host + '/appService/app/loginByWechat';
      wx.request({
        url: url,
        data: params,
        method: 'post',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          if (res.data.code == 0 && res.data.data.isRegister == 1) {
           // wx.setStorageSync("openid", openId);
            wx.setStorageSync('token', res.data.data.access_token);
            wx.setStorageSync('userId', res.data.data.userId);
            that.globalData.userInfo.userId = res.data.data.userId;
            wx.setStorageSync('phone', res.data.data.phone);
            resolve(res.data.data);
          } else {
            wx.clearStorageSync();
            reject(false);
          }
          setTimeout(()=>{
            wx.hideLoading();
          },1000)
        }
      })
    });
  },

  /**
   * 获取手机号
   */
  getPhoneRequest(encryptedData, iv, sessionKey) {
    let that = this;
    let params = {
      header: {},
      body: {
        encryptedData: encryptedData,
        iv: iv,
        sessionKey: sessionKey,
      }
    }
    let url = that.globalData.host + '/appService/wxProgram/getPhone';
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: url,
      data: params,
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 0) {
          that.globalData.phone = res.data.data.purePhoneNumber;
          if (res.data.data.purePhoneNumber) {
            wx.setStorageSync('phone', res.data.data.purePhoneNumber);
            that.bindWxProgramRequest(res.data.data.purePhoneNumber);
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '获取手机号失败',
            })
          }
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '获取手机号失败',
            icon: 'none',
          })
        }
      }
    })
  },

  /**
   * 绑定手机后成为用户
   */
  bindWxProgramRequest(phone) {
    if (!wx.getStorageSync("unionid")) {
      wx.showToast({
        title: '请授权获取个人信息',
        icon: 'none'
      })
      return false;
    }
    let that = this;
    let params = {
      header: {},
      body: {
        openId: wx.getStorageSync("openid"),
        phone: phone,
        unionId: wx.getStorageSync("unionid"),
      }
    }
    let url = getApp().globalData.host + '/appService/wxProgram/bindWxProgram';
    wx.request({
      url: url,
      data: params,
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 0) {
          if (res.data.data.phone) {
            that.getTokenRequest(phone, function() {});
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '绑定失败',
              icon: 'none'
            })
          }
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '绑定失败',
            icon: 'none'
          })
        }
      }
    })
  },

  /**
   * 获取token
   */
  getTokenRequest(phone, backcall) {
    let that = this;
    let params = {
      header: {},
      body: {
        phone: phone
      }
    }
    let url = getApp().globalData.host + '/appService/app/getToken';
    wx.request({
      url: url,
      data: params,
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 0) {
          console.log(res);
          that.globalData.userInfo.token = res.data.data.access_token;
          that.globalData.userInfo.userId = res.data.data.userId;
          wx.setStorageSync('token', res.data.data.access_token);
          wx.setStorageSync('userId', res.data.data.userId)
          wx.setStorageSync('tokenOverFlag', true)
          if (wx.getStorageSync('isAuthorize') && wx.getStorageSync('token')) {
            wx.navigateBack({ //返回
              delta: 1
            })
          }
          backcall();
          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({
              title: '登录成功'
            })
          }, 50)

        } else {
          wx.hideLoading();
          wx.showToast({
            title: res.data.message,
          })
        }
      }
    })
  },

  watch: function(method, name) {
    var obj = this.globalData.userInfo;
    Object.defineProperty(obj, name, {
      configurable: true,
      enumerable: true,
      set: function(value) {
        this._name = value;
        method(value);
      },
      get: function() {
        return this._name;
      }
    })
  },

  globalData: {
    userInfo: {
      userId: wx.getStorageSync('userId') || '',
      userName: wx.getStorageSync('userName') || '',
      token: wx.getStorageSync('token') || '',
    },
    host: baseUrl,
    openid: wx.getStorageSync('openid') || '',
    appid: 'wx3c6db4ca66cddc80',
    unionid: wx.getStorageSync('unionid') || '',
    session_key: wx.getStorageSync('session_key') || '',
    phone: wx.getStorageSync('phone') || '',
    session_key: wx.getStorageSync('session_key') || '',
    noJumpIndex: [
      'pages/personalCenter/myRecord/recordDetail',
      'pages/patient/filloutInfoPC/filloutInfoPC',
      'pages/personalCenter/customerService/customerService',
      'pages/personalCenter/healthRecord/examinationData'
    ]

  },
  API: new agriknow(),
  bigApi: new BigApi()
})