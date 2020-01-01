// pages/personalCenter/order/mallOrderDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderStatus: 0,  //订单状态:0_待付款,1_待发货,2_待收货,3_已完成,4_已取消,5_售后
    orderData: null,
    noDatashow: false,  //无数据显示
    isCancelOrderFlag: false,
    chooseCancelReasonIndex: null,
    orderId: '',
    timeOut: '',
    orderStatusInquiry: null, 
    rxAuditState: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.orderId){
      this.setData({
        orderId: options.orderId
      })
    }
  },

  /**
   * 支付
   */
  payfor: function (e) {
    var orderId = e.currentTarget.dataset['id'];
    console.log(orderId)
    wx.navigateTo({
      url: '/pages/mall/pay/pay?orderId=' + orderId + '&businessType=2' + '&jumpType=2'
    })
  },

  /**
   * 跳转去评价
   */
  gotoEvaluate: function (e) {
    let id = e.currentTarget.dataset['id'];
    wx.navigateTo({
      url: `/pages/personalCenter/evaluate/evaluate?id=${id}`
    })
  },

  /**
   * 确定商城订单收货
   */
  confirmReceipt: function (e) {
    var orderId = e.currentTarget.dataset['id'];
    const that = this;
    let params = {
      header: {},
      body: {
        "mallOrderId": orderId,
      }
    };
    getApp().API.confirmReceipt(params).then(data => {
      if (data.code == 0) {
        wx.showToast({
          title: '已确定收货',
          icon: 'success',
          duration: 1000
        })
        wx.navigateTo({
          url: '/pages/personalCenter/order/receiving?orderId=' + orderId
        })
      }
    }).catch(err => {
      wx.showToast({
        title: '确定收货失败',
        icon: 'none',
        duration: 1000
      })
    })
  },

  /**
   * 商城重新购买
   */
  repurchase: function (e) {
    var id = e.currentTarget.dataset['id'];
    wx.setStorage({
      key: "remark",
      data: ""
    })
    // wx.navigateTo({
    //   url: '/pages/mall/orderConfirm/orderConfirm?confirmOrderSource=3&orderNo=' + id
    // })
    this.efficacyAjax(id)
  },

  /**
   * 取消商城订单
   */
  cancelMallOrder: function (e) {
    var orderId = e.currentTarget.dataset['id'];
    const that = this;
    this.cancelOrderRequest(0,orderId,null)
  },

  /**
   * 取消商城订单
   */
  cancelOrderRequest(status, orderId, cancelReason){
    let that = this;
    let params = {
      header: {},
      body: {
        orderNo: orderId,
        userId: wx.getStorageSync('userId'),
        cancelReason: cancelReason
      }
    };
    getApp().API.cancelOrder(params).then(data => {
      if (data.code == 0) {
        if (status == 1) {
          wx.showModal({
            showCancel: false,
            title: '订单取消成功!',
            content: '订单金额将在1到7个工作日原路退回',
            success(res) {
            }
          })
          that.refundMoney(data.data.refundId);
          that.setData({
            isCancelOrderFlag: false
          })
        }else{
          wx.showToast({
            title: '订单已取消',
            icon: 'none',
            duration: 1000
          })
          
        }
        wx.navigateTo({
          url: '/pages/personalCenter/order/order?active=5'
        })
      }
    }).catch(err => {
      wx.showToast({
        title: '订单取消失败',
        icon: 'none',
        duration: 1000
      })
    })
  },

  /**
   * 获取商城订单详情
   */
  getOrderDetail: function (orderId) {
    const that = this;
    let params = {
      header: {},
      body: {
        "orderNo": orderId,
      }
    };
    getApp().API.getOrderDetail(params).then(data => {
      
      if (data.code == 0) {
        var resData = data.data;
        if (resData.comList.length) {
          var goodsNum = 0;
          for (var j in resData.comList) {
            goodsNum = goodsNum + resData.comList[j].qty;
          }
          resData.goodsNum = goodsNum;
        } else {
          resData.goodsNum = '0';
        }
        if (resData.inquiryPrice){
          resData.inquiryPrice = resData.inquiryPrice.toFixed(2);
        }
        
        resData.freight = resData.freight.toFixed(2);
        this.setData({
          orderData: resData,
        });
        if (resData.timeOut){
          this.setTimeCount();
        }

        this.getInquiryOrderDetails(data.data.officeVisitOrderId);
      }else{
        this.setData({
          noDatashow: true,
        });
      }
    }).catch(err => {
      this.setData({
        noDatashow: true,
      });
    })
  },

  /**
   * 获取开方状态
   */
  getInquiryOrderDetails(orderId){
    let params = {
      header: {},
      body: {
        orderId: orderId
      }
    }

    getApp().API.getInquiryOrderDetails(params).then(res => {
      console.log(res);
      if(res.code == 0){
        this.setData({
          orderStatusInquiry: res.data.orderStatus,
          rxAuditState: res.data.rxAuditState
        })
      }
    })
  },

  /**
   * 失效商品
   */
  efficacyAjax(id) {
    let params = {
      header: {},
      body: {
        orderId: id
      }
    }
    getApp().API.rebuyCheck(params).then(res => {
      console.log(res);
      if (res.code == 0) {
        if (res.data.stockoutList.length > 0) {
          this.setData({
            isShow: true,
            efficacyOrderId: id,
            listDatas: res.data.stockoutList
          })
          console.log(this.data.listDatas);
          console.log(res.data.stockoutList);

        } else {
          wx.navigateTo({
            url: '/pages/mall/orderConfirm/orderConfirm?confirmOrderSource=3&orderNo=' + id
          })
        }
      }
    })
  },

  /**
  * 倒计时
  */
  setTimeCount: function () {
    let time = this.data.orderData.timeOut;
    var timeOut, mm, ss;
    time--;
    if (time <= 0) {
      time = 0;
      clearTimeout(t)
      this.setData({
        timeOut: "",
      })
      return
    }else{
      if (time > 60) {
        mm = parseInt(time / 60);
        ss = parseInt(time % 60);
        timeOut = "支付剩余：" + mm + "分" + ss + "秒";;
      }else{
        timeOut = "支付剩余：" + time + "秒";
      }
    }
    this.setData({
      'orderData.timeOut': time,
      timeOut: timeOut,
    })
    var t = setTimeout(this.setTimeCount, 1000);
  },

  /**
   * 取消待发货订单
   */
  cancelOrder(e){
    console.log(e);
    let orderId = e.currentTarget.dataset.id;
    this.setData({
      isCancelOrderFlag: true,
      orderId: orderId
    })
  },

  /**
   * 待发货取消订单后退款
   */
  refundMoney(refundId) {
    let params = {
      header: {},
      body: {
        refundId: refundId
      }
    }
    getApp().API.refundMoney(params).then(res => {
      if (res.code == 0 && res.data.isSuccess == 1) {
        wx.showToast({
          title: '取消成功，等待退款',
          icon: 'none'
        });
        setTimeout(()=>{
          wx.navigateTo({
            url: '/pages/personalCenter/order/order?active=5'
          })
        },2000)
      }
    })
  },

  /**
   * 暂不取消
   */
  orderNoCancel(){
    this.setData({
      isCancelOrderFlag: false
    })
  },

  /**
   * 确定取消
   */
  orderSureCancel(){
    this.setData({
      isCancelOrderFlag: false
    });
    this.cancelOrderRequest(1, this.data.orderId, this.data.chooseCancelReasonIndex);
  },

  /**
   * 跳转到聊天
   */
  jumpChatPage() {
    if(this.data.orderData.orderStatus == 0){
      wx.showToast({
        title: '请支付问诊费',
        icon: 'none',
      })
      return false;
    }
    let token = wx.getStorageSync('token');
    let orderId = this.data.orderData.officeVisitOrderId;
    let url = `/pages/chat/index/index?orderId=${orderId}&token=${token}&inquiryType=9`
    wx.navigateTo({
      url: url,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 选择退款理由
   */
  chooseCancelReason(e) {
    this.setData({
      chooseCancelReasonIndex: e.currentTarget.dataset.index
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
    var pages = getCurrentPages(); // 获取页面栈
    var currPage = pages[pages.length - 1]; // 当前页面
    this.getOrderDetail(currPage.options.orderId);   //获取商城订单详情
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

  },

  /**
   * 跳转查看物流页面
   */
  gotoLogisticsInfo: function (e) {
    var expressCom = e.currentTarget.dataset['name'];
    var expressNo = e.currentTarget.dataset['id'];
    var orderId = e.currentTarget.dataset['orderid'];
    wx.navigateTo({
      url: '/pages/personalCenter/order/logisticsInfo?expressNo=' + expressNo + '&expressCom=' + expressCom + '&orderId=' + orderId
    })
  }, 

  /**
   * 跳转售后
   */
  gotoAfterSale: function (e) {
    var orderId = e.currentTarget.dataset['id'];
    var orderType = e.currentTarget.dataset['type'];
    wx.navigateTo({
      url: '/pages/personalCenter/order/afterSale?orderId=' + orderId + '&orderType=' + orderType
    })
  },

  /**
   * 跳转到商品详情
   */
  jumpProductDetail(e){
    var columnId = e.currentTarget.dataset.columnid;
    var commodityId = e.currentTarget.dataset.commodityid;
    var isRx = e.currentTarget.dataset.isrx;
    let url = '';
    if(isRx == 1){
      url = `/pages/mall/product/productDetail/productDetail?comId=${commodityId}&columnId=${columnId}&shareUserId=0&isRx=1`
    }else{
      url = `/pages/mall/product/productDetail/productDetail?comId=${commodityId}&columnId=${columnId}&shareUserId=0`;
    }
    wx.navigateTo({
      url: url
    })
  }
})