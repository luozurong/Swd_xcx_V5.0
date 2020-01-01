// pages/authorization/authorization.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    message: '正在申请获取您的用户信息',
    btnMsg: '微信快捷登录/注册',
    hasUnionIdFlag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().loginRequest(()=>{});
    if (wx.getStorageSync('unionid')) {
      this.setData({
        hasUnionIdFlag: false
      })
    } else {
      this.setData({
        hasUnionIdFlag: true
      })
    }
  },

  /**
  * 获取手机号
  */
  getPhoneNumber(e) {
    if(!wx.getStorageSync('unionid')){
      wx.showToast({
        title: '请授权获取微信个人信息',
        icon: 'none'
      })
    } 

    if (e.detail.errMsg == "getPhoneNumber:fail user deny") return false;
    let iv = e.detail.iv;
    let encryptedData = e.detail.encryptedData;
    if (!iv) return false;

    wx.setStorageSync('isAuthorize', true);
    
    wx.checkSession({
      success() {
        let sessionKey = wx.getStorageSync("session_key");
        let opendId = wx.getStorageSync('openid');
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  }
})