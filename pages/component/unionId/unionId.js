
Component({
  properties: {
    hasUnionIdFlag: null
  },
  data: {
   
  },
  attached() {

  },
  pageLifetimes: {
    show: function () {
      console.log(this.data.hasUnionIdFlag)
    },
    hide: function(){
     
    }
  },
  methods: {
    /**
     * 获取用户信息（微信）
     */
    getuserinfo(){
      let that = this;
      wx.getUserInfo({
        success: function (res) {
          if (res.errMsg == 'getUserInfo:ok'){
            wx.checkSession({
              success() {
                that._loginRequest(res.encryptedData, res.iv);
                //that._myunionId(res.encryptedData, res.iv, wx.getStorageSync('session_key'));
              },
              fail() {   //有可能有问题encryptedData、iv（是否会改变）
                //getApp().loginRequest(function () {
                  //that._myunionId(res.encryptedData, res.iv, wx.getStorageSync('session_key'));
                //})
                that._loginRequest(res.encryptedData, res.iv);
              }
            })
          }
        }
      })
    },

    jumpBack(){
      wx.navigateBack();
    },

    /**
     * 获取unionid的请求
     */
    _myunionId(encryptedData, iv, sessionKey){
      let that = this;
      let params = {
        header: {},
        body: {
          encryptedData: encryptedData,
          iv: iv,
          sessionKey: sessionKey,
        }
      }
      let url = getApp().globalData.host + '/appService/wxProgram/getPhone';
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
          wx.hideLoading();
          if (res.data.code == 0) {
            console.log(res.data.data)
            if (res.data.data.unionId){
              wx.setStorageSync('unionid', res.data.data.unionId);
              that.setData({
                hasUnionIdFlag: false
              })
            }
          }
        }
      })
    },
    _loginRequest(encryptedData, iv) {
      let that = this;
      wx.login({
        success: res => {
          let params = {
            header: {},
            body: {
              code: res.code
            }
          }
          let url = getApp().globalData.host + '/appService/wxProgram/getOpenId';
          wx.request({
            url: url,
            data: params,
            method: 'post',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              if (res.data.code == 0) {
                //console.log('opendid='+res.data.data.openid);
                //that.globalData.openid = res.data.data.openid;
                //that.globalData.unionid = res.data.data.unionid;
                //that.globalData.session_key = res.data.data.session_key;
                wx.setStorageSync("openid", res.data.data.openid);
                //if (res.data.data.unionid){
                 wx.setStorageSync("unionid", res.data.data.unionid);
                //}
                wx.setStorageSync("session_key", res.data.data.session_key);
                //back();
                that._myunionId(encryptedData, iv, res.data.data.session_key);
                
              }
            }
          })
        }
      })
    },
  }
})