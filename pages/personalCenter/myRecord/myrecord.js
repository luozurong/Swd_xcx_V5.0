// pages/personalCenter/myrecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataSource: [],
    current: 1, // 请求页码
    loadStatus: true,
    noDataFlag: false, //无数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(11111)
    this.getMyMedicalList();
  },
  getMyMedicalList(current) {
    wx.showLoading({
      title: '加载中..',
    })
    const that = this;
    let params = {
      header: {},
      body: {
        roleId: wx.getStorageSync('userId'),
        pageSize: 10,
        pageNum: current
      }
    };
    getApp().API.getMyMedicalList(params).then(data => {
      if (data.code == 0) {
        wx.hideLoading();
        let dataObj = this.data.dataSource;
        if (data.data.records.length > 0) {
          for (var i = 0; i < data.data.records.length; i++) {
            var showDate = data.data.records[i].visitDate.substring(0,data.data.records[i].visitDate.length-3) ;
            data.data.records[i].showDate = showDate ;
            dataObj.push(data.data.records[i])
          }
        }
        that.setData({
          dataSource: dataObj
        });
        console.log(that.data.dataSource)
        if (data.data.records.length < 10) {
          if (data.data.records.length < 1) {
            that.setData({
              noDataFlag: true
            })
          } else {
            that.setData({
              noDataFlag: false
            })
          }
        } else {
          let pageNumber = that.data.current + 1;
          that.setData({
            current: pageNumber,
            loadStatus: true,
            noDataFlag: false
          })
        }
      }
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  torecordDetail(currentItem) {
    let visitObj = currentItem.currentTarget.dataset.visitobj;
    let visitType = 10;
    if (visitObj.orderType == 9) { 
      visitType = 10
    }
    wx.navigateTo({
      url: './recordDetail?orderId=' + visitObj.orderId + "&visitType=" + visitType
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.loadStatus) {
      this.getMyMedicalList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})