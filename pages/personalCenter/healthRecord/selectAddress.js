// pages/personalCenter/healthRecord/selectAddress.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    flagIndex: 1,
    addressData: [],    //所有地址
    provinceData: [],    //所有省的地址
    cityData: [],    //所在省所有市的地址
    prefectureData: [],   //所在市所有县/区的地址
    townData: [],     //所在县/区所有镇/街道的地址
    selectedData: [],   //已选地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =  this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://nfys-static.kinglian.cn/xcx/data/town.JSON',//json数据地址
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var tempArr = [];
        for (var i in res.data){
          if (res.data[i].FAreaNumber == '0086'){
            tempArr.push(res.data[i])
          }
        }
        that.setData({
          // addressData: res.data,
          provinceData: tempArr,
        });

        app.globalData.addressData = res.data;
        wx.hideLoading()
      },
      fail: function(){
        wx.hideLoading()
      }
    })
  },

  /**
   * 选择市（点击省）
   */
  selectProvince: function (e) {
    var that = this;
    var FNumber = e.currentTarget.dataset['index'];
    var name = e.currentTarget.dataset['name'];
    var selectedArr = that.data.selectedData;
    selectedArr.push(name)
    var tempArr = [];
    for (var i in app.globalData.addressData) {
      if (app.globalData.addressData[i].FAreaNumber == FNumber) {
        tempArr.push(app.globalData.addressData[i])
      }
    }
    that.setData({
      flagIndex: 2,
      cityData: tempArr,
      selectedData: selectedArr,
    });
  },

  /**
   * 选择县（点击市）
   */
  selectCity: function (e) {
    var that = this;
    var FNumber = e.currentTarget.dataset['index'];
    var name = e.currentTarget.dataset['name'];
    var selectedArr = that.data.selectedData;
    selectedArr.push(name)
    var tempArr = [];
    for (var i in app.globalData.addressData) {
      if (app.globalData.addressData[i].FAreaNumber == FNumber) {
        tempArr.push(app.globalData.addressData[i])
      }
    }
    that.setData({
      flagIndex: 3,
      prefectureData: tempArr,
      selectedData: selectedArr,
    });
  },

  /**
   * 选择镇/街道（点击县/区）
   */
  selectPrefecture: function (e) {
    var that = this;
    var FNumber = e.currentTarget.dataset['index'];
    var name = e.currentTarget.dataset['name'];
    var selectedArr = that.data.selectedData;
    selectedArr.push(name)
    var tempArr = [];
    for (var i in app.globalData.addressData) {
      if (app.globalData.addressData[i].FAreaNumber == FNumber) {
        tempArr.push(app.globalData.addressData[i])
      }
    }
    that.setData({
      flagIndex: 4,
      townData: tempArr,
      selectedData: selectedArr,
    });
  },

  /**
   * 选择社区（点击镇/街道）
   */
  selectTown: function (e) {
    var that = this;
    var FNumber = e.currentTarget.dataset['index'];
    var name = e.currentTarget.dataset['name'];
    var selectedArr = that.data.selectedData;
    selectedArr.push(name)
    that.setData({
      flagIndex: 5,
      selectedData: selectedArr,
    });
    wx.navigateTo({
      url: '/pages/personalCenter/healthRecord/basicInfo'
    })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  retreat: function() {
    var that = this;
    var flagIndex = that.data.flagIndex;
    flagIndex--;
    var selectedArr = that.data.selectedData;
    selectedArr.pop();
    if (flagIndex== 1){
      selectedArr.pop();
    }
    that.setData({
      selectedData: selectedArr,
      flagIndex: flagIndex,
    });
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