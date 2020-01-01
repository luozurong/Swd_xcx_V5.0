// pages/personalCenter/healthBonus/healthBonus.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataSource: [], // 数据
    current: 1, // 请求页码
    loadStatus: true,
    totalBonus: 0 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHealthBonus(1)
  },
  getHealthBonus(current) {
    const that = this;
    let params = {
      header: {},
      body: {
        roleId: wx.getStorageSync('userId'),
        pageNumber: current,
        pageSize: 10,
      }
    };
    getApp().API.getHealthBonus(params).then( data => {
      if(data.code == 0) {
        that.setData({dataSource: data.data.page.records})
        that.setData({totalBonus:data.data.totalBonus})
        if(data.data.page.records.length < 10) {
          that.setData({loadStatus: false})
        } else {
          let pageNumber = that.data.current + 1;
          that.setData({
            current: pageNumber,
            loadStatus: true
          })
        }
      }
    }).catch( err => {
      wx.showToast({
        title: err,
        icon: 'none',
        duration: 2000
      });
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
    if(this.data.loadStatus) {
      this.getHealthBonus(this.data.current)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})