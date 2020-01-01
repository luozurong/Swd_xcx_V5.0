// pages/personalCenter/order/afterSale.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '', //订单id
    afterSaleObj: [],
    pics: [], //图片
    orderType: 0, //订单类型0：商城订单， 1：问诊订单
    issueDes: '', //商品描述
    result: [],   //选择售后的商品
    sheetShow: false, //弹框
    sheetShowList: ['不想要了', '商品降价了', '商品质量有问题', '其它'], //原因列表
    radio: '',
    refundReason: '',  //售后原因
    placeHolderStatus: false // placeholder文字状态
  },

  /**
   * 已选售后原因
   */
  subimt(){
    const that = this;
    this.setData({
      refundReason: this.data.sheetShowList[this.data.radio],
      sheetShow: false
    });
    setTimeout(() => {
      that.setData({ placeHolderStatus: false });
    },500)
  },

  // /**
  //  * 未选售后原因
  //  */
  // subimtNull() {
  //   wx.showToast({
  //     title: '请选择您的售后原因',
  //     icon: 'none',
  //     duration: 1000
  //   })
  // },

  /**
   * 弹框开启
   */
  showSheet (){
    this.setData({ sheetShow: true });
    this.setData({ placeHolderStatus: true });
  },

  /**
   * 弹框关闭
   */
  onClose() {
    console.log('close')
    this.setData({ 
      sheetShow: false,
    });
    setTimeout(() => {
      this.setData({ placeHolderStatus: false });
    },500)
    if (!this.data.refundReason){
      this.setData({
        radio: '',
      });
    }
  },

  onClick(event) {
    const that = this;
    const { name } = event.currentTarget.dataset;
    this.setData({
      radio: name+'',
      refundReason: this.data.sheetShowList[name],
      sheetShow: false,
    });
    setTimeout(() => {
      that.setData({ placeHolderStatus: false });
    },500)
  },

  onChange(event) {
    this.setData({
      result: event.detail
    });
  },

  bindblur(e){
    this.setData({
      issueDes:e.detail.value
    })
  },

  /**
   * 获取售后订单商品信息
   */
  chooseGoods() {
    wx.showToast({
      title: '请选择您的售后商品',
      icon: 'none',
      duration: 1000
    })
  },

  /**
   * 获取售后订单商品信息
   */
  getOrderCommodity(orderId) {
    let params = {
      header: {},
      body: {
        orderId: orderId
      }
    };
    wx.showLoading({
      title: '加载中..',
    })
    app.API.getOrderCommodity(params).then(res => {
      if (res.code == 0) {
        var resData = res.data;
        if (resData.length){
          this.setData({
            afterSaleObj: resData
          })
        }
      }
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
    }).catch(err => {
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
    })
  },

  /**
   * 提交售后申请
   */
  saveRefundOrder() {
    if (!this.data.refundReason){
      wx.showToast({
        title: '请选择您的售后原因，便于我们给您更快处理',
        icon: 'none',
        duration: 1000
      })
      return
    }
    var orderCommodityIdList = [];
    var userId = wx.getStorageSync('userId')
    var refundImg = this.data.pics.join(";")
    let params = {
      header: {},
      body: {
        orderId: this.data.orderId,
        roleId: userId,
        description: this.data.issueDes,
        refundReason: this.data.refundReason,
        refundImg: refundImg,
        orderCommodityIdList: this.data.result,
      }
    };
    wx.showLoading({
      title: '申请提交中..',
    })
    app.API.saveRefundOrder(params).then(res => {
      if (res.code == 0) {
        var refundOrderId = res.data;
        setTimeout(function () {
          wx.hideLoading()
          wx.showToast({
            title: '售后申请提交成功',
            icon: 'none',
            duration: 1000
          })
        }, 1050)
        wx.redirectTo({
          url: '/pages/personalCenter/order/afterSaleDetail?refundOrderId=' + refundOrderId + '&orderType=' + this.data.orderType
        })
      }
    }).catch(err => {
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      orderType: options.orderType,
      orderId: options.orderId,
    });
    this.getOrderCommodity(options.orderId)
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
    var currPage = pages[pages.length - 1]; //当前页面
    if (currPage.options.orderId){
      this.getOrderDetail(currPage.options.orderId)
    }
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
        if (resData.isApplyRefund == 1){
          wx.navigateBack({//返回
            delta: 1
          })
        }
      } else {
        this.setData({
          noDatashow: true,
        });
      }
    }).catch(err => {
    })
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
   * 图片放大查看
   */
  previewImg: function(e) {

    var index = e.target.dataset.index; //当前图片地址
    var imgArr = e.target.dataset.list; //所有要预览的图片的地址集合 数组形式
    console.log(index, imgArr)
    wx.previewImage({
      current: imgArr[index],
      urls: imgArr,
    })
  },
  /**
   * 图片上传
   * 
   */

  //上传图片开始
  chooseImg: function (e) {
    var that = this,
      pics = this.data.pics;
    if (pics.length < 5) {
      wx.chooseImage({
        count: 5 - that.data.pics.length, // 最多可以选择的图片张数，默认9
        sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          wx.showToast({
            title: '正在上传...',
            icon: 'loading',
            mask: true,
            duration: 1000
          });
          for (var i in tempFilePaths){
            wx.uploadFile({
              url: getApp().globalData.host + '/oss/oss/upload', //仅为示例，非真实的接口地址
              filePath: tempFilePaths[i],
              name: 'file',
              formData: {
                'user': 'test'
              },
              success(res) {
                const data = JSON.parse(res.data);
                var tempArr = [data.data.uploadFilePath]
                if (data.code == 0) {
                  wx.showToast({
                    title: '上传成功',
                    icon: 'success',
                    duration: 500
                  })
                  that.setData({
                    pics: that.data.pics.concat(tempArr)
                  })
                } else {
                  wx.showToast({
                    title: '上传失败',
                    icon: 'warn',
                    duration: 500
                  })
                }
              },
              fail: function (res) {
                wx.showToast({
                  title: '上传失败',
                  icon: 'warn',
                  duration: 500
                })
              }
            })
          }
        },
      });
    } else {
      wx.showToast({
        title: '最多上传5张图片',
        icon: 'none',
        duration: 1500
      });
    }
  },
  // 删除图片
  deleteImg: function(e) {
    var that = this;
    var pics = this.data.pics;
    var index = e.currentTarget.dataset.index;
    pics.splice(index, 1);
    console.log(pics)
    this.setData({
      pics: pics,
    })
  },
  // 预览图片
  previewImg1: function(e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var pics = this.data.pics;
    wx.previewImage({
      //当前显示图片
      current: pics[index],
      //所有图片
      urls: pics
    })
  },
})