// pages/personalCenter/consultNum/consultNum.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    consultType: 6,   //咨询类型 6：名医咨询  7：药师咨询
    status: 0,    //使用状态（0未使用1已使用2已过期）
    listData:  [],
    current: 1,   //当前页码
    noDatashow: false, //无数据显示
    noMore: false, //没有更多了
    nomoreShow: false, //没有更多页面显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.consultType == 6){
      wx.setNavigationBarTitle({
        title: '名医咨询次数',
      })
    }else{
      wx.setNavigationBarTitle({
        title: '药师咨询次数',
      })
    }
    this.setData({
      consultType: options.consultType,
    });
    this.getConsultTimeList();
  },

  /**
   * 获取咨询次数列表
   */
  onChange(event) {
    var status = event.detail.index;
    this.setData({
      status: status,
      listData: [],
      current: 1,
    })
    this.getConsultTimeList();
  },

  /**
   * 获取咨询次数列表
   */
  getConsultTimeList(consultType, status) {
    const that = this;
    let params = {
      header: {},
      body: {
        consultType: that.data.consultType,   //咨询类型（1名医2药师）
        status: that.data.status,   //使用类型（0未使用1已使用2已过期）
        current: that.data.current,       //页码
        size: 20,          //每页数量
      }
    };
    wx.showLoading({
      title: '加载中..',
    })
    getApp().API.getConsultTimeList(params).then(data => {
      if (data.code == 0) {
        var resData = data.data.records;
        if (resData.length>0) {
          var tempArr = this.data.listData;
          for (var i in resData) {
            tempArr.push(resData[i])
          }
          this.setData({
            noDatashow: false,
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
            nomoreShow: true,
          });
        }
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
      }
    }).catch(err => {
      var tempArr = this.data.listData;
      this.setData({
        listData: tempArr,
        noDatashow: true,
      });
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
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
  onShareAppMessage: function (e) {
    var columnId = e.target.dataset.columnid;
    var commodityId = e.target.dataset.commodityid; 
    var serviceName = e.target.dataset.servicename; 
    console.log(e.target)
    var that = this;
    var shareimg = [
      "https://nfys-static.kinglian.cn/xcx/download/logo.png",
    ]
    var randomImg = shareimg[Math.floor(Math.random() * shareimg.length)];
    return {
      title: serviceName + '-问诊服务',
      desc: '',
      path: '/pages/mall/product/productDetail/productDetail?comId=' + columnId + '&columnId=' + commodityId + '&source=' + 'serviceConsult',
      imageUrl: randomImg, // 可以更换分享的图片
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功',
          icon: "none"
        });
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '分享失败',
          icon: "none"
        })
      }
    }
  },

  /**
   * 用户点击微信转赠
   */
  onShare: function(e) {
    this.onShareAppMessage
  },

  /**
   * 用户点击微信转赠
   */
  shareFriend: function (e) {
    var commodityId = e.currentTarget.dataset['commodityid'];
    var columnId = e.currentTarget.dataset['columnid'];
    wx.navigateTo({
      url: '/pages/personalCenter/consultNum/share?comId=' + columnId + '&columnId=' + commodityId
    })
  },
})