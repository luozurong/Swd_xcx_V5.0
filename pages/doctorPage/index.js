// pages/doctor-page/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    show: false,
    isShow: false,
    dataSource: {},
    doctorId: 'c06ef0070aa6454e93a1fa9b98fd4ed7',
    isShowLength: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  /**    app跳转小程序start     **/
  onLoad: function (options) {
    let that = this;
    this.setData({
      doctorId: options.doctorId
    })
    console.log(options)
    this.getDoctorPage();
    getApp().watch(that.getUserId, 'userId')
    if (options.src) {
      getApp().loginRequest(function () {
        getApp().lxjlogin(options.token);
      })
    }
    this.isLoginFlagFunc();
  },
  getUserId(userId){
    if(userId){
      this.isLoginFlagFunc();
      wx.showToast({
        title: '登陆成功',
      })
    }
  },

  //判断是否已经登录
  isLoginFlagFunc() {
    setTimeout(() => {
      if (wx.getStorageSync('userId') && wx.getStorageSync('openid') && wx.getStorageSync('token')) {
        this.setData({
          isLoginFlag: true
        })
        wx.setStorageSync('isLoginFlag', true);
      } else {
        this.setData({
          isLoginFlag: false
        })
        wx.setStorageSync('isLoginFlag', false);
      }
    }, 50)
  },
   
  /**
  * 获取手机号
  */
  getPhoneNumber(e) {
    if (e.detail.errMsg == "getPhoneNumber:fail user deny") return false;
    let iv = e.detail.iv;
    let encryptedData = e.detail.encryptedData;
    if (!iv) return false;
    wx.checkSession({
      success() {
        let sessionKey = wx.getStorageSync("session_key");
        let opendId = wx.getStorageInfo('openid');
        if (opendId && sessionKey) {
          getApp().getPhoneRequest(encryptedData, iv, sessionKey);
        } else {
          getApp().loginRequest(function () {  //兼容sessionKey、opendId不存在
            let sessionKey = wx.getStorageSync("session_key");
            getApp().getPhoneRequest(encryptedData, iv, sessionKey);
          })
        }
      },
      fail() {
        wx.showToast({
          title: '重新验证'
        });
        getApp().loginRequest(function () {
          let sessionKey = wx.getStorageSync("session_key");
          getApp().getPhoneRequest(encryptedData, iv, sessionKey);
        })
      }
    })
  },

  /**    app跳转小程序end      **/
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  getDoctorPage() {
    const that = this;
    this.setData({loading: false});
    let params = {
      header: {},
      body: {
        doctorId: this.data.doctorId
      }
    }
    wx.showLoading({
      title: '加载中..',
    })
    getApp().API.getDoctorPage(params).then( res => {
      if (res.data.visitTypePrice){
        let arr = res.data.visitTypePrice.split('.')
        res.data.num = arr[0];
        res.data.decimals = arr[1];
      }else {
        res.data.num = false;
        res.data.decimals = '00';
      }
      that.setData({dataSource: res.data})
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
      this.setData({loading: true});
    }).catch( err => {
      console.log(err)
      this.setData({loading: true});
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
    })
  },
  jumpFillout() { // 跳转就诊人信息
    let that = this;
    if (!wx.getStorageSync("token") && !wx.getStorageSync("token")){
      wx.navigateTo({
        url: '/pages/authorization/authorization'
      });
      return false;
    }
    wx.navigateTo({
      url: `../patient/filloutInfo/filloutInfo?expertId=${that.data.doctorId}`
    })
  },
  onReady: function () {

  },
  showPopup() {
    this.setData({show: true})
  },
  onClose() {
    this.setData({ show: false });
  },
  toComment() {
    wx.navigateTo({
      url: './allComment'
    })
  },
  tojumb(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `./articleNews?id=${id}`,
    })
  },
  changeShow() {
    this.setData({isShow: !this.data.isShow})
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const that = this ;
    return {
      title: '名医堂：'+that.data.dataSource.name,
      path: `pages/index/index?doctorId=${that.data.doctorId}&type=article`,
    }
  }
})