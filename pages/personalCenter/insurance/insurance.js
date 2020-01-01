// pages/personalCenter/insurance/insurance.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInsuranceList();
  },

  /**
   * 我的保险
   */
  getInsuranceList() {
    const that = this;
    let params = {
      header: {},
      body: {
        current: 1,       //页码
        size: 10,          //每页数量
      }
    };
    getApp().API.getInsuranceList(params).then(data => {
      if (data.code == 0) {
        that.setData({
          dataSource: data.data
        })
      }
    }).catch(err => { })
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