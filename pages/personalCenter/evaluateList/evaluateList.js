// pages/personalCenter/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderType: 1,  //订单类型1：商城订单， 2：问诊订单
    active: 0,  //当前激活的标签索引
    records: [],
    current: 1,
    isNoData: false,
    isLoadingMore: true //是否加载更多
  },

  /**
   * 更换订单类型
   */
  changeType(event) {
    console.log('picker发送选择改变，携带值为', event.detail.index + 1);
    this.setData({
      orderType: event.detail.index + 1,
      active: 0,
    });
  },

  /**
   * 获取待评价列表
   */
  getOrderList(){
    let that = this;
    let params = {
      header: {},
      body: {
        current: that.data.current,
        size: 10,
        userId: wx.getStorageSync('usesrId'), 
        isEvaluate: 0
      }
    }
    wx.showLoading({
      title: '加载中',
    })
    getApp().API.getOrderList(params).then((res) => {
      wx.hideLoading();
      if(res.code == 0){
        let resTamp = res.data.records;
        let myRecords = that.data.records;
        let recordsTamp = myRecords.concat(resTamp);

        for (let i in recordsTamp){
          for(let k in recordsTamp[i].comList){
            if(recordsTamp[i].comList[k].hasEntity == 1){
              recordsTamp[i].hasEntity = 1
              break;
            }else{
              recordsTamp[i].hasEntity = 0;
            }
          }
        }

        that.setData({
          records: recordsTamp
        })
        
        if (resTamp.length < 10){
          that.setData({
            records: recordsTamp,
            isLoadingMore: false
          })
        }else{
          let current = that.data.current;
          current += 1;
          that.setData({
            current: current,
            isLoadingMore: true
          })
        }

        if (recordsTamp.length > 0){  //缺省
          that.setData({
            isNoData: false
          })
        }else{
          that.setData({
            isNoData: true
          })
        }
      } 
    })
  },

  jumpProductDetail(e){
    let commodityId = e.target.dataset.id;
    let columnId = e.target.dataset.columnid;
    wx.navigateTo({
      url: `/pages/mall/product/productDetail/productDetail?comId=${commodityId}&columnId=${columnId}&shareUserId=0`,
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      active: options.active,
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
    this.setData({
      current: 1,
      records: []
    });
    this.getOrderList();
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
    if (this.data.isLoadingMore){
      this.getOrderList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 跳转商城订单详情
   */
  gotoMallOrderDetail: function (e) {
    var index = e.currentTarget.dataset['index'];
    let id = e.currentTarget.dataset.id;
    let isapplyrefund = e.currentTarget.dataset.isapplyrefund;
    if (isapplyrefund == 0){
      wx.navigateTo({
        url: '/pages/personalCenter/order/mallOrderDetail?orderId=' + id
      })
    }else{
      wx.navigateTo({
        url: '/pages/personalCenter/order/mallOrderDetail?orderType=0' + '&orderId=' + id
      })
    }
   
  },

  /**
   * 跳转问诊订单详情
   */
  gotoInquiryOrderDetail: function (e) {
    var index = e.currentTarget.dataset['index'];
    wx.navigateTo({
      url: '/pages/personalCenter/order/inquiryOrderDetail?orderStatus=' + index
    })
  },

  /**
   * 跳转售后
   */
  gotoAfterSale: function (e) {
    let id = e.target.dataset.id;
    let orderType = e.target.dataset.orderType;
    console.log(orderType);
    wx.navigateTo({
      url: '/pages/personalCenter/order/afterSale?orderType=' + orderType + '&orderId=' + id
    })
  },

  /**
   * 跳转售后详情
   */
  gotoAfterSaleDetail: function (e) {
    console.log(e);
    let id = e.target.dataset.id;
    let orderType = e.target.dataset.ordertype;
  
    console.log(orderType);
    wx.navigateTo({
      url: '/pages/personalCenter/order/afterSale?orderType=' + orderType + '&orderId=' + id
    })
  },

  /**
   * 跳转查看物流页面
   */
  gotoLogisticsInfo: function (e) {
    // wx.navigateTo({
    //  url: '/pages/personalCenter/order/logisticsInfo'
    // })
    console.log(e);
    let expressNo = e.target.dataset.expressno;
    let expressCom = e.target.dataset.expresscom

    wx.navigateTo({
      url: '/pages/personalCenter/order/logisticsInfo?expressNo=' + expressNo + '&expressCom=' + expressCom
    })
  },

  /**
   * 跳转去评价
   */
  gotoEvaluate: function (e) {
    let id = e.target.dataset.id;
    wx.navigateTo({
      url: `/pages/personalCenter/evaluate/evaluate?id=${id}&source=evaluateList`
    })
  },

})