// pages/personalCenter/consultNum/share.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberList: [],
    commodityId: null,
    comId: null,
  },

  /**
   * 转赠亲友
   */
  share: function (e) {
    var patientId = e.currentTarget.dataset['id'];
    var patientName = e.currentTarget.dataset['name'];
    wx.showModal({
      title: '请确认是否转赠给' + patientName +'？',
      content: '转赠不可撤回',
      confirmColor: '#3ac756',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showToast({
            title: '转赠成功！',
            icon: 'success',
            duration: 2000
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.comId){
      this.setData({
        comId: options.comId,
      })
    }
    if (options.commodityId) {
      this.setData({
        commodityId: options.commodityId,
      })
    }
    this.getPatientList();
  },

  /**
   * 获取亲友管理信息
   */
  getPatientList() {
    const that = this;
    let params = {
      header: {},
      body: {
        pageNumber: 1,
        pageSize: 20,
      }
    };
    getApp().API.getPatientList(params).then(data => {
      if (data.code == 0) {
        if (data.data.memberList.length > 0) {
          that.setData({
            memberList: data.data.memberList,
          })
        }
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