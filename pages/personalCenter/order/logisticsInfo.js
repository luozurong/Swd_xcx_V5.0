// pages/personalCenter/order/logisticsInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    steps: [],
    resData: null,
    expressType: '1', //'快递方式：0快递。1健管师'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.getExpressInfo(options.expressNo, options.expressCom, options.orderId);
    if (options.expressNo == 'null' && options.expressCom == 'null'){
      this.setData({
        expressType: '0',
      })
    }
  },

  /**
   * 获取商城订单物流信息
   */
  getExpressInfo: function (expressNo, expressCom, orderId) {
    const that = this;
    let params = {
      header: {},
      body: {
        "expressNo": expressNo,
        "expressCom": expressCom,
        "orderId": orderId,
      }
    };
    getApp().API.getExpressInfo(params).then(data => {
      if (data.code == 0) {
        var resData = data.data;
        var steps = JSON.parse(JSON.stringify(resData.data).replace(/ftime/g, 'desc'));
        steps = JSON.parse(JSON.stringify(steps).replace(/context/g, 'text'));
        if (resData.com == 'yunda'){
          resData.com = '韵达'
        } else if (resData.com == 'shentong'){
          resData.com = '申通'
        } else if (resData.com == 'yuantong') {
          resData.com = '圆通'
        } else if (resData.com == 'ems') {
          resData.com = '邮政'
        } else if (resData.com == 'zhongtong') {
          resData.com = '中通'
        } else if (resData.com == 'baishi') {
          resData.com = '百世'
        } else if (resData.com == 'jingdong') {
          resData.com = '京东'
        } else if (resData.com == 'jd') {
          resData.com = '京东'
        } else if (resData.com == 'debang') {
          resData.com = '德邦'
        } else if (resData.com == 'tiantian') {
          resData.com = '天天'
        } else if (resData.com == 'zhaijisong') {
          resData.com = '宅急送'
        } else if (resData.com == 'huitong') {
          resData.com = '汇通'
        }
        this.setData({
          resData: resData,
          steps: steps,
        })
      }
    }).catch(err => {
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