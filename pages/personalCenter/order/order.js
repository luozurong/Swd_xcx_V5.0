// pages/personalCenter/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderType: 1, //订单类型1：商城订单， 2：问诊订单
    active: null, //当前激活的标签索引,
    listData: [],
    current: 1, //当前页码
    malltabs: ['全部', '待付款', '待发货', '待收货', '已完成', '已取消'],
    noDatashow: false, //无数据显示
    noMore: false, //没有更多了
    nomoreShow: false, //没有更多页面显示
    orderStatus: '', //当前商城订单状态【0：待付款，1：待发货，2：待收货，3：已完成，4：已取消，5：售后】  
    statusCode: '0', //当前问诊订单状态【0：全部，1：待付款，7：问诊中，200：已完成，300：订单关闭，5：售后】  
    inquirytabs: ['全部', '待付款', '问诊中', '已完成', '订单关闭'],
    isCancelOrderFlag: false,
    chooseOrderId: '',
    chooseCancelReasonIndex: null,
    isShow: false,
    efficacyOrderId: '',  //失效商品订单的id
    listDatas: []
  },
  
   /**
   * 问诊支付
   */
  inquiryPayfor: function(e) {
    var orderId = e.currentTarget.dataset['id'];
    console.log(orderId)
    wx.navigateTo({
      url: '/pages/mall/pay/pay?orderId=' + orderId + '&businessType=1' + '&jumpType=1'
    })
  },
  
  /**
   * 商城支付
   */
  payfor: function(e) {
    var orderId = e.currentTarget.dataset['id'];
    console.log(orderId)
    wx.navigateTo({
      url: '/pages/mall/pay/pay?orderId=' + orderId + '&businessType=2' + '&jumpType=2'
    })
  },
  

  /**
   * 商城重新购买
   */
  repurchase: function(e) {
    let that = this;
    wx.setStorage({
      key: "remark",
      data: ""
    })
    var id = e.currentTarget.dataset['id'];
    this.efficacyAjax(id) 
  },

  /**
   * 失效商品
   */
  efficacyAjax(id,back) {
    let params = {
      header: {},
      body: {
        orderId: id
      }
    }
    getApp().API.rebuyCheck(params).then(res => {
      console.log(res);
      if(res.code == 0){
        if (res.data.stockoutList.length > 0){
          this.setData({
            isShow: true,
            efficacyOrderId: id,
            listDatas: res.data.stockoutList
          })
          console.log(this.data.listDatas);
          console.log(res.data.stockoutList);

        }else{
          wx.navigateTo({
            url: '/pages/mall/orderConfirm/orderConfirm?confirmOrderSource=3&orderNo=' + id
          })
        }
      }
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
        that.setData({
          listData: [],
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
   * 取消问诊订单
   */
  cancelInquiryOrder: function(e) {
    var orderId = e.currentTarget.dataset['id'];
    const that = this;
    let params = {
      header: {},
      body: {
        "orderId": orderId,
      }
    };
    getApp().API.cancelInquiryOrder(params).then(data => {
      if (data.code == 0) {
        wx.showToast({
          title: '订单已取消',
          icon: 'success',
          duration: 1000
        })
        that.setData({
          listData: [],
        })
        that.getInquiryOrderList();
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
   * 取消待支付商城订单
   */
  cancelMallOrder: function(e) {
    var orderId = e.currentTarget.dataset['id'];
    const that = this;
    this.cancelOrderRequest(0,orderId,'')
  },

  /**
   * 取消订单请求
   */
  cancelOrderRequest(status,orderId,cancelReason){
    let  cancelReasonValue = ''
    if (cancelReason == 0){
      cancelReasonValue = '地址/电话等信息填写错误'
    }
    if (cancelReason == 1) {
      cancelReasonValue = '活动/优惠未生效'
    }
    if (cancelReason == 2) {
      cancelReasonValue = '商品降价了'
    }
    if (cancelReason == 3) {
      cancelReasonValue = '拍错/多拍/不想要'
    }
    let that = this;
    let params = {
      header: {},
      body: {
        orderNo: orderId,
        userId: wx.getStorageSync('userId'),
        cancelReason: cancelReasonValue
      }
    };
    getApp().API.cancelOrder(params).then(data => {
      if (data.code == 0) {
        if(status == 0) {
          wx.showToast({
            title: '订单已取消',
            icon: 'success',
            duration: 1000
          })
        }else if(status == 1) {
          wx.showModal({
            showCancel: false,
            title: '订单取消成功!',
            content: '订单金额将在1到7个工作日原路退回',
            success(res) {
            }
          })
        }
        this.setData({
          listData: [],
          current: 1,
          active: 5,
          noMore: false,
          noDatashow: false,
          nomoreShow: false,
          orderStatus: 4,
        });
        setTimeout(function () {
          that.getMallOrderList();
          if(status == 1){
            that.refundMoney(data.data.refundId);
            that.setData({
              isCancelOrderFlag: false
            })
          }
        }, 1000)
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
   * 更换问诊订单状态
   */
  changeInquiryOrder(event) {
    console.log('picker发送选择改变，携带值为', event.detail.index - 1);
    var statusCode = event.detail.index;
    if (statusCode == 2) {
      statusCode = '7'
    } else if (statusCode == 3){
      statusCode = '200'
    } else if (statusCode == 4) {
      statusCode = '300'
    }
    this.setData({
      listData: [],
      current: 1,
      noMore: false,
      noDatashow: false,
      nomoreShow: false,
      statusCode: statusCode,
    });
    this.getInquiryOrderList();
  },

  /**
   * 更换商城订单状态
   */
  changeMallOrder(event) {
    // console.log('picker发送选择改变，携带值为', event.detail.index - 1);
    var orderStatus = event.detail.index - 1;
    if (orderStatus == -1) {
      orderStatus = ''
    }
    this.setData({
      listData: [],
      current: 1,
      active: event.detail.index,
      noMore: false,
      noDatashow: false,
      nomoreShow: false,
      orderStatus: orderStatus,
    });
    if (this.data.orderStatus == '5') {
      this.getRefundPage();
    } else {
      this.getMallOrderList();
    }
  },

  /**
   * 更换订单类型
   */
  changeType(event) {
    console.log('picker发送选择改变，携带值为', event.detail.index + 1);
    this.setData({
      listData: [],
      current: 1,
      noMore: false,
      noDatashow: false,
      nomoreShow: false,
      orderStatus: '',
      statusCode: '0',
      orderType: event.detail.index + 1,
      active: 0,
    });
    if (event.detail.index + 1 == 1) {
      this.getMallOrderList();
    } else {
      this.getInquiryOrderList();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 获取商城售后订单列表
   */
  getRefundPage: function () {
    const that = this;
    let params = {
      header: {},
      body: {
        "current": this.data.current,
        "size": 20,
      }
    };
    wx.showLoading({
      title: '加载中..',
    })
    getApp().API.getRefundPage(params).then(data => {
      if (data.code == 0) {
        var resData = data.data.records;
        if (resData.length) {
          var tempArr = this.data.listData;
          for (var i in resData) {
            tempArr.push(resData[i])
            if (resData[i].comList.length) {
              var goodsNum = 0;
              for (var j in resData[i].comList) {
                goodsNum = goodsNum + resData[i].comList[j].qty;
              }
              resData[i].goodsNum = goodsNum;
            } else {
              resData[i].goodsNum = '0';
            }
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
   * 获取问诊订单列表
   */
  getInquiryOrderList: function() {
    const that = this;
    let params = {
      header: {},
      body: {
        pageNumber: this.data.current,
        statusCode: 0,
        // statusCode: this.data.statusCode,
        pageSize: 20,
      }
    };
    wx.showLoading({
      title: '加载中..',
    })
    getApp().API.getInquiryOrderList(params).then(data => {
      if (data.code == 0) {
        var resData = [];
        if (that.data.statusCode == '0') {
          resData = data.data.list;
        }else{
          for (var i in data.data.list){
            if (that.data.statusCode == data.data.list[i].statusCode) {
              resData.push(data.data.list[i])
            }
          }
        }
        if (resData.length) {
          var tempArr = this.data.listData;
          for (var i in resData) {
            if (resData[i].patientInfo.gender == '1') {
              resData[i].patientInfo.gender = '男'
            } else {
              resData[i].patientInfo.gender = '女'
            }
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
        setTimeout(function() {
          wx.hideLoading()
        }, 500)
      }
    }).catch(err => {
      var tempArr = this.data.listData;
      this.setData({
        listData: tempArr,
        noDatashow: true,
      });
      setTimeout(function() {
        wx.hideLoading()
      }, 500)
    })
  },

  /**
   * 问诊订单上拉
   */
  inquiryOrderUpper: function() {
    // console.log('上拉加载')
  },

  /**
   * 问诊订单下拉
   */
  inquiryOrderLower: function() {
    // console.log('下拉刷新')
    if (this.data.noMore) {
      this.setData({
        nomoreShow: true,
      });
    } else {
      this.getInquiryOrderList();
    }
  },

  /**
   * 获取商城订单列表
   */
  getMallOrderList: function() {
    const that = this;
    let params = {
      header: {},
      body: {
        "current": this.data.current,
        "orderStatus": this.data.orderStatus,
        "size": 20,
        "userId": wx.getStorageSync('userId')
        // "isEvaluate": null,
      }
      
    };
    wx.showLoading({
      title: '加载中..',
    })
    getApp().API.getOrderList(params).then(data => {
      if (data.code == 0) {
        var resData = data.data.records;
        if (resData.length) {
          var tempArr = this.data.listData;
          for (var i in resData) {
            tempArr.push(resData[i])
            if (resData[i].comList.length) {
              var goodsNum = 0;
              for (var j in resData[i].comList) {
                goodsNum = goodsNum + resData[i].comList[j].qty;
              }
              resData[i].goodsNum = goodsNum;
            } else {
              resData[i].goodsNum = '0';
            }
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
        setTimeout(function() {
          wx.hideLoading()
        }, 500)
      }
    }).catch(err => {
      var tempArr = this.data.listData;
      this.setData({
        listData: tempArr,
        noDatashow: true,
      });
      setTimeout(function() {
        wx.hideLoading()
      }, 500)
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
    }) 
    this.cancelOrderRequest(1, this.data.chooseOrderId, this.data.chooseCancelReasonIndex)
  },

  /**
   * 选择退款理由
   */
  chooseCancelReason(e){
    this.setData({
      chooseCancelReasonIndex: e.currentTarget.dataset.index
    })
  },

  /**
   * 待发货取消订单
   */
  cancelOrder(e){
    let that = this;
    let id = e.target.dataset.id;
    this.setData({
      isCancelOrderFlag: true,
      chooseOrderId: id
    }) 
  },

  /**
   * 待发货取消订单后退款
   */
  refundMoney(refundId){
    let params = {
      header: {},
      body: {
        refundId: refundId
      }
    }
    getApp().API.refundMoney(params).then( res => {
      if (res.code == 0 && res.data.isSuccess == 1){
        wx.showToast({
          title: '取消成功，等待退款',
          icon: 'none'
        });
        this.setData({
          isCancelOrderFlag: false
        })
      }
    })
  },

  /**
   * 商城订单上拉
   */
  mallOrderUpper: function() {
    // console.log('上拉加载')
  },

  /**
   * 商城订单下拉
   */
  mallOrderLower: function() {
    // console.log('下拉刷新')
    if (this.data.noMore) {
      this.setData({
        nomoreShow: true,
      });
    } else {
      if (this.data.orderStatus == '5') {
        this.getRefundPage();
      } else {
        this.getMallOrderList();
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var pages = getCurrentPages(); // 获取页面栈
    var currPage = pages[pages.length - 1]; // 当前页面
    console.log(currPage)
    if (currPage.data.orderType == 2) {
      this.changeInquiryOrder(2)
      return
    }
    var orderStatus = '';
    var active = null
    if (currPage.data.active){
      active = currPage.data.active
    } else if (currPage.options.active){
      active = currPage.options.active
    }
    if (active == '0') {
      orderStatus = '';
    } else if (active == '1') {
      orderStatus = '0';
    } else if (active == '2') {
      orderStatus = '1';
    } else if (active == '3') {
      orderStatus = '2';
    } else if (active == '6') {
      orderStatus = '5';
    } else if (active == '4') {
      orderStatus = '3';
    } else if (active == '5') {
      orderStatus = '4';
    }
    this.setData({
      listData: [],
      current: 1,
      active: active,
      orderStatus: orderStatus
    });
    if (active == '6') {
      this.getRefundPage();
    } else {
      this.getMallOrderList();
    }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 跳转商城订单详情
   */
  gotoMallOrderDetail: function(e) {
    var orderId = e.currentTarget.dataset['id'];
    if (this.data.orderStatus == '5'){
      wx.navigateTo({
        url: '/pages/personalCenter/order/afterSaleDetail?refundOrderId=' + orderId + '&orderType=0'
      })
    }else{
      wx.navigateTo({
        url: '/pages/personalCenter/order/mallOrderDetail?orderId=' + orderId
      })
    }
  },

  /**
   * 跳转问诊订单详情
   */
  gotoInquiryOrderDetail: function(e) {
    var orderId = e.currentTarget.dataset['id'];
    wx.navigateTo({
      url: '/pages/personalCenter/order/inquiryOrderDetail?orderId=' + orderId
    })
  },

  /**
   * 跳转售后
   */
  gotoAfterSale: function(e) {
    var orderId = e.currentTarget.dataset['id'];
    var orderType = e.currentTarget.dataset['type'];
    wx.navigateTo({
      url: '/pages/personalCenter/order/afterSale?orderId=' + orderId + '&orderType=' + orderType
    })
  },

  /**
   * 跳转查看物流页面
   */
  gotoLogisticsInfo: function(e) {
    var expressCom = e.currentTarget.dataset['name'];
    var expressNo = e.currentTarget.dataset['id'];
    var orderId = e.currentTarget.dataset['orderid'];
    wx.navigateTo({
      url: '/pages/personalCenter/order/logisticsInfo?expressNo=' + expressNo + '&expressCom=' + expressCom + '&orderId=' + orderId
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
   * 跳转商品详情
   */
  gotoMallDeatil: function (e) {
    let id = e.currentTarget.dataset.id;
    let columnId = e.currentTarget.dataset.columnid;
    wx.navigateTo({
      url: `/pages/mall/product/productDetail/productDetail?comId=${id}&columnId=${columnId}&shareUserId=0`,
    })
  },

})