// pages/personalCenter/collection/collection.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    noDatashow: false, //无数据显示
    noMore: false, //没有更多了
    nomoreShow: false, //没有更多页面显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCollectionList();
  },

  /**
   * 加载
   */
  collectionLower: function () {
    // console.log('下拉刷新')
    if (this.data.noMore) {
      this.setData({
        nomoreShow: true,
      });
    } else {
      this.getCollectionList();
    }
  },

  /**
   * 跳转文章详情
   */
  gotoDeatil: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/doctorPage/articleNews?id=' + id
    })
  },

  /**
   * 获取咨询次数列表
   */
  getCollectionList() {
    const that = this;
    let params = {
      header: {},
      body: {
        current: 1,       //页码
        size: 10,          //每页数量
      }
    };
    getApp().API.getCollectionList(params).then(data => {
      if (data.code == 0) {
        var resData = data.data.records;
        // console.log(resData)
        if (resData.length) {
          var tempArr = this.data.listData;
          for (var i in resData) {
            tempArr.push(resData[i])
          }
          this.setData({
            listData: tempArr,
          });
        } else {
          var tempArr = this.data.listData;
          this.setData({
            listData: tempArr,
            noDatashow: true,
          });
        }
        if (resData.length == 20) {
          this.setData({
            current: this.data.current + 1,
          });
        } else {
          this.setData({
            noMore: true,
          });
        }
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
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