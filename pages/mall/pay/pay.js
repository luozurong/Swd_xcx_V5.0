Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    payInfo: {},
    businessType: '', //1问诊订单 2商城订单 3药品订单 4献爱心订单 5问诊自费订单
    jumpType: '', //跳转判断
    submitFlag: true,
    balance: '0.00',
    payType: null,
    orderPrice: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!options.businessType) {
      options.businessType = "2" //商城订单
    }
    if (!options.jumpType) {
      options.businessType = "2" //商城订单
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.setData({
      orderId: options.orderId,
      businessType: options.businessType,
      jumpType: options.jumpType
    });

    this.getPayOrderInfoRequest();
    this.getIncomeInfoList();
  },

  /**
   * 选择支付方式
   */
  choosePay(e) {
    let payType = e.target.dataset.index;
    this.setData({
      payType: payType
    })
  },

  /**
   * 获取订单信息
   */
  getPayOrderInfoRequest() {
    let that = this;
    let params = {
      header: {},
      body: {
        businessType: that.data.businessType,
        orderId: this.data.orderId,
      }
    }

    getApp().API.getPayOrderInfo(params).then((res) => {
      wx.hideLoading();
      if (res.code == 0) {
        let payInfo = res.data;
        that.setData({
          payInfo: payInfo,
          orderPrice: Number(payInfo.orderPrice)
        })
      }
    });
  },
  goPay() {
    if (this.data.payType == 3) {
      this.unifyOrder(3);  
    } else if (this.data.payType == 4) {
      this.unifyOrder(4);
    } else if (this.data.payType == 2) {
      this.wxProgramPayRequest(this.data.orderId);
    } else {
      wx.showToast({
        title: '请选择支付方式',
        icon: 'none'
      })
    }
  },
  /**
   * 余额支付请求
   */
  unifyOrder(payType) {
    let params = {
      header: {},
      body: {
        payType: payType,
        orderId: this.data.orderId,
        businessType: this.data.businessType
      }
    }
    getApp().API.unifyOrder(params).then(res => {
      wx.hideLoading();
      if (res.code == 0) {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(() => {
          this.jumpPage('success')
          // wx.redirectTo({
          //   url: '/pages/personalCenter/order/mallOrderDetail?orderId=' + this.data.orderId
          // })
        }, 2000);
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  /**
   * 微信生成签名等
   */
  wxProgramPayRequest(orderId) {
    let that = this;
    if (!this.data.submitFlag) return false;
    this.setData({
      submitFlag: false
    });
    let params = {
      header: {},
      body: {
        orderId: orderId,
        openId: wx.getStorageSync("openid"),
        businessType: that.data.businessType
      }
    }
    getApp().API.wxProgramPay(params).then(res => {
      if (res.code == 0) {
        //微信支付
        wx.requestPayment({
          timeStamp: res.data.timeStamp.toString(),
          nonceStr: res.data.nonceStr,
          package: res.data.wxPackage,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success(data) {
            console.log(data);
            that.wxProgramOrderQuery(orderId, res.data.wxPackage);
            that.setData({
              submitFlag: true
            });
          },
          fail(data) {
            console.log(data);
            wx.showToast({
              title: '支付失败',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              submitFlag: true
            });
            setTimeout(() => {
              that.jumpPage('cancel');
            }, 2000)
          }
        })
      } else {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none'
        })
      }
    }).catch(() => {
      wx.showToast({
        title: '网络连接失败',
        icon: 'none'
      })
    })
  },
  /**
   * 支付后跳转
   */
  jumpPage(status) {
    var token = wx.getStorageSync('token');
    if (status == 'success') { //成功后跳转
      if (this.data.jumpType == 1) { //问诊跳转
        wx.redirectTo({
          url: "/pages/chat/index/index?orderId=" + this.data.orderId + "&inquiryType=" + 6 + '&source=chatView'
        })
      } else if (this.data.jumpType == 2) { //商城跳转
        wx.redirectTo({
          url: '/pages/personalCenter/order/mallOrderDetail?orderId=' + this.data.orderId
        })
      }
    } else if (status == 'cancel') {
      if (this.data.jumpType == 1) { //问诊跳转
        wx.navigateBack({
          delta: 3
        });
      }
    }
  },
  /**
   * 查询支付结果
   */
  wxProgramOrderQuery(orderId, prepayId) {
    let that = this;
    let params = {
      header: {},
      body: {
        orderId: orderId,
        prepayId: prepayId,
        openId: wx.getStorageSync('openid')
      }
    }
    getApp().API.wxProgramOrderQuery(params).then(res => {
      if (res.code == 0) {
        if (res.data.status == 0) {
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(() => {
            that.jumpPage('success');
          }, 2000);
        } else {
          wx.showToast({
            title: '支付失败',
            icon: 'success',
            duration: 2000
          })
          setTimeout(() => {
            that.jumpPage('cancel');
          }, 2000);
        }
      }
    })
  },

  /**
   * 获取余额
   */
  getIncomeInfoList() {
    let that = this;
    let params = {
      header: {},
      body: {},
    }

    getApp().API.getIncomeInfoList(params).then(res => {
      if (res.code == 0) {
        this.setData({
          balance: Number(res.data.balance.toFixed(2))
        });
      }
    })
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

  }
})